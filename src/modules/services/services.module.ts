import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades (Ya estaban)
import { Service } from './infrastructure/entities/service.entity';
import { ServiceType } from './infrastructure/entities/service-type.entity';

// Repositorios (El nuevo y el viejo)
import { ServiceRepository } from './domain/service.repository';
import { TypeOrmServiceRepository } from './infrastructure/persistence/service.repository';
import { ServiceTypeRepository } from './domain/service-type.repository'; // <--- NUEVO
import { TypeOrmServiceTypeRepository } from './infrastructure/persistence/service-type.repository'; // <--- NUEVO

// Controladores (El nuevo y el viejo)
import { ServicesController } from './infrastructure/controllers/services.controller';
import { ServiceTypesController } from './infrastructure/controllers/service-types.controller'; // <--- NUEVO

// Servicios / Casos de Uso (Los 6 cerebros: 3 viejos, 3 nuevos)
import { CreateServiceService } from './application/create-service/create-service.service';
import { GetAllServicesService } from './application/get-all-services/get-all-services.service';
import { DeleteServiceService } from './application/delete-service/delete-service.service';
import { CreateServiceTypeService } from './application/create-service-type/create-service-type.service'; // <--- NUEVO
import { GetAllServiceTypesService } from './application/get-all-service-types/get-all-service-types.service'; // <--- NUEVO
import { DeleteServiceTypeService } from './application/delete-service-type/delete-service-type.service'; // <--- NUEVO

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceType]),
  ],
  controllers: [
    ServicesController, 
    ServiceTypesController // <--- AGREGAR
  ], 
  providers: [
    // Repositorios
    { provide: ServiceRepository, useClass: TypeOrmServiceRepository },
    { provide: ServiceTypeRepository, useClass: TypeOrmServiceTypeRepository }, // <--- AGREGAR

    // Casos de Uso
    CreateServiceService, GetAllServicesService, DeleteServiceService,
    CreateServiceTypeService, GetAllServiceTypesService, DeleteServiceTypeService // <--- AGREGAR
  ],
  exports: [ServiceRepository, ServiceTypeRepository],
})
export class ServicesModule {}