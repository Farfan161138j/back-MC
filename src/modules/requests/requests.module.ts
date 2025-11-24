import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
// 👇 ESTOS DOS TE FALTABAN ARRIBA 👇
import { UpdateRequestStatusService } from './application/update-request-status/update-request-status.service';
import { GetAllRequestsService } from './application/get-all-requests/get-all-requests.service';

// Controller
import { RequestsController } from './infrastructure/controllers/requests.controller';

@Module({
  imports: [
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
  ],
  exports: [],
})
export class RequestsModule {}