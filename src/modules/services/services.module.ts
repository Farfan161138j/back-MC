import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades
import { Service } from './infrastructure/entities/service.entity';
import { ServiceType } from './infrastructure/entities/service-type.entity';

// Repositorio
import { ServiceRepository } from './domain/service.repository';
import { TypeOrmServiceRepository } from './infrastructure/persistence/service.repository';

// Casos de Uso (Services) <-- IMPORTAR ESTOS 3
import { CreateServiceService } from './application/create-service/create-service.service';
import { GetAllServicesService } from './application/get-all-services/get-all-services.service';
import { DeleteServiceService } from './application/delete-service/delete-service.service';


import { ServicesController } from './infrastructure/controllers/services.controller'; // <--- IMPORTAR
@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceType]),
  ],
  controllers: [ServicesController,], // Aún vacío, falta el último paso
  providers: [
    // Repositorio
    {
      provide: ServiceRepository,
      useClass: TypeOrmServiceRepository,
    },
    // Registrar los Casos de Uso
    CreateServiceService,
    GetAllServicesService,
    DeleteServiceService,
  ],
  exports: [ServiceRepository],
})
export class ServicesModule {}