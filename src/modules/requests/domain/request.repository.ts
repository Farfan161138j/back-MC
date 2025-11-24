import { Request } from '../infrastructure/entities/request.entity';

export interface RequestRepository {
  save(request: Request): Promise<Request>;


  findByUserId(userId: number): Promise<Request[]>;
  findAll(): Promise<Request[]>;             
}

export const RequestRepository = Symbol('RequestRepository');