import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades
import { Request } from './infrastructure/entities/request.entity';
import { RequestItem } from './infrastructure/entities/request-item.entity';
import { RequestStatus } from './infrastructure/entities/request-status.entity';

// Repository
import { RequestRepository } from './domain/request.repository';
import { TypeOrmRequestRepository } from './infrastructure/persistence/request.repository';

// Service
import { CreateRequestService } from './application/create-request/create-request.service';

// Controller
import { RequestsController } from './infrastructure/controllers/requests.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, RequestItem, RequestStatus]), 
  ],
  controllers: [RequestsController],
  providers: [
    { provide: RequestRepository, useClass: TypeOrmRequestRepository },
    CreateRequestService
  ],
  exports: [],
})
export class RequestsModule {}