import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../entities/request.entity';
import { RequestRepository } from '../../domain/request.repository';

@Injectable()
export class TypeOrmRequestRepository implements RequestRepository {
  constructor(
    @InjectRepository(Request)
    private readonly ormRepo: Repository<Request>,
  ) {}

  async save(request: Request): Promise<Request> {
    return this.ormRepo.save(request);
  }
}