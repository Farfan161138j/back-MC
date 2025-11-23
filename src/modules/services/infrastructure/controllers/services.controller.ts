import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe, 
  UseGuards, 
  Request, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';

// DTO
import { CreateServiceDto } from './dto/create-service.dto';

// Casos de Uso (Services)
import { CreateServiceService } from '../../application/create-service/create-service.service';
import { GetAllServicesService } from '../../application/get-all-services/get-all-services.service';
import { DeleteServiceService } from '../../application/delete-service/delete-service.service';

// Seguridad (Guardias y Roles)
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleEnum } from '../../../users/domain/roles.enum';

@Controller('services')
export class ServicesController {
  
  constructor(
    private readonly createService: CreateServiceService,
    private readonly getAllServices: GetAllServicesService,
    private readonly deleteService: DeleteServiceService,
  ) {}

  // --- CREAR (SOLO ADMIN) ---
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Candado
  @Roles(RoleEnum.ADMIN)               // 2. Solo Admin
  async create(@Body() dto: CreateServiceDto, @Request() req) {
    // Pasamos el ID del usuario que está en el token para el campo 'createdBy'
    return this.createService.execute(dto, req.user.id);
  }

  // --- LEER TODOS (PÚBLICO) ---
  @Get()
  @HttpCode(HttpStatus.OK)
  // Sin Guards: Queremos que los clientes vean el catálogo sin loguearse
  async findAll() {
    return this.getAllServices.execute();
  }

  // --- BORRAR (SOLO ADMIN) ---
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Candado
  @Roles(RoleEnum.ADMIN)               // 2. Solo Admin
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteService.execute(id);
  }
}