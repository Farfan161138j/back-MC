import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Body, 
  Param, 
  ParseIntPipe, 
  UseGuards, 
  Request, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';

// DTOs
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';

// Servicios (Casos de Uso)
import { CreateRequestService } from '../../application/create-request/create-request.service';
import { GetMyRequestsService } from '../../application/get-my-requests/get-my-requests.service';
import { UpdateRequestStatusService } from '../../application/update-request-status/update-request-status.service';
import { GetAllRequestsService } from '../../application/get-all-requests/get-all-requests.service';
import { GenerateWhatsappLinkService } from '../../application/generate-whatsapp-link/generate-whatsapp-link.service'; // <--- 1. NUEVO IMPORT

// Seguridad
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleEnum } from '../../../users/domain/roles.enum';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  
  constructor(
    private readonly createRequest: CreateRequestService,
    private readonly getMyRequests: GetMyRequestsService,
    private readonly updateStatus: UpdateRequestStatusService,
    private readonly getAllRequests: GetAllRequestsService,
    private readonly whatsappService: GenerateWhatsappLinkService, // <--- 2. INYECCIÓN
  ) {}

  // 1. CREAR SOLICITUD Y GENERAR LINK
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRequestDto, @Request() req) {
    // A. Guardamos el pedido en BD
    const request = await this.createRequest.execute(dto, req.user.id);
    
    // B. Generamos el link con el pedido guardado
    const link = this.whatsappService.execute(request);

    // C. Retornamos la respuesta mixta
    return {
      message: 'Solicitud creada correctamente',
      whatsappUrl: link, // <--- ¡AQUÍ ESTÁ EL LINK PARA EL BOTÓN!
      data: request
    };
  }

  // 2. VER MIS PEDIDOS
  @Get('my-requests')
  @HttpCode(HttpStatus.OK)
  async findMine(@Request() req) {
    return this.getMyRequests.execute(req.user.id);
  }

  // 3. VER TODOS LOS PEDIDOS (Dashboard Admin)
  @Get() 
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.getAllRequests.execute();
  }

  // 4. CAMBIAR ESTADO (Admin)
  @Patch(':id/status')
  @UseGuards(RolesGuard) 
  @Roles(RoleEnum.ADMIN) 
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequestStatusDto
  ) {
    return this.updateStatus.execute(id, dto);
  }
}