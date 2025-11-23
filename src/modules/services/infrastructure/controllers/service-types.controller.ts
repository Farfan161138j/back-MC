import { 
  Controller, Get, Post, Delete, Body, Param, 
  ParseIntPipe, UseGuards, HttpCode, HttpStatus 
} from '@nestjs/common';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { CreateServiceTypeService } from '../../application/create-service-type/create-service-type.service';
import { GetAllServiceTypesService } from '../../application/get-all-service-types/get-all-service-types.service';
import { DeleteServiceTypeService } from '../../application/delete-service-type/delete-service-type.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { RoleEnum } from '../../../users/domain/roles.enum';

@Controller('service-types')
export class ServiceTypesController {
  constructor(
    private readonly createService: CreateServiceTypeService,
    private readonly getAllService: GetAllServiceTypesService,
    private readonly deleteService: DeleteServiceTypeService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(@Body() dto: CreateServiceTypeDto) {
    return this.createService.execute(dto);
  }

  @Get()
  async findAll() {
    return this.getAllService.execute();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteService.execute(id);
  }
}