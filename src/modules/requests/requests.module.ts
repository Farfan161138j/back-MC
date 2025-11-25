import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // <--- IMPORTAR
// Entidades
import { Request } from './infrastructure/entities/request.entity';
import { RequestItem } from './infrastructure/entities/request-item.entity';
import { RequestStatus } from './infrastructure/entities/request-status.entity';
import { Product } from '../products/infrastructure/entities/product.entity';

// Repository
import { RequestRepository } from './domain/request.repository';
import { TypeOrmRequestRepository } from './infrastructure/persistence/request.repository';

// Services
import { CreateRequestService } from './application/create-request/create-request.service';
import { GetMyRequestsService } from './application/get-my-requests/get-my-requests.service';
import { UpdateRequestStatusService } from './application/update-request-status/update-request-status.service';
import { GetAllRequestsService } from './application/get-all-requests/get-all-requests.service';
import { GenerateWhatsappLinkService } from './application/generate-whatsapp-link/generate-whatsapp-link.service'; // <--- IMPORTAR

// Controller
import { RequestsController } from './infrastructure/controllers/requests.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Request, 
      RequestItem, 
      RequestStatus, 
      Product
    ]), 
  ],
  controllers: [RequestsController],
  providers: [
    // Repositorio
    { provide: RequestRepository, useClass: TypeOrmRequestRepository },
    
    // Servicios (Casos de uso)
    CreateRequestService,
    GetMyRequestsService,
    UpdateRequestStatusService,
    GetAllRequestsService, 
    GenerateWhatsappLinkService, // <--- AGREGAR AQUÍ
  ],
  exports: [],
})
export class RequestsModule {}