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
import { GetAllRequestsService } from '../../application/get-all-requests/get-all-requests.service'; // <--- NUEVO IMPORT

// Seguridad
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleEnum } from '../../../users/domain/roles.enum';

@Controller('requests')
@UseGuards(JwtAuthGuard) // 🔒 Candado global: Solo usuarios logueados entran aquí
export class RequestsController {
  
  constructor(
    private readonly createRequest: CreateRequestService,
    private readonly getMyRequests: GetMyRequestsService,
    private readonly updateStatus: UpdateRequestStatusService,
    private readonly getAllRequests: GetAllRequestsService, // <--- NUEVA INYECCIÓN
  ) {}

  // 1. CREAR SOLICITUD (Cualquier usuario logueado)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRequestDto, @Request() req) {
    return this.createRequest.execute(dto, req.user.id);
  }

  // 2. VER MIS PEDIDOS (Historial del cliente)
  @Get('my-requests')
  @HttpCode(HttpStatus.OK)
  async findMine(@Request() req) {
    return this.getMyRequests.execute(req.user.id);
  }

  // 3. VER TODOS LOS PEDIDOS (Dashboard del Admin) - NUEVO ENDPOINT
  @Get() // Ruta: GET /requests
  @UseGuards(RolesGuard) // 🛡️ Activamos guardia de roles
  @Roles(RoleEnum.ADMIN) // 👮 Solo el Admin puede ver la lista completa
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.getAllRequests.execute();
  }

  // 4. CAMBIAR ESTADO Y RESTAR STOCK (Solo Admin)
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