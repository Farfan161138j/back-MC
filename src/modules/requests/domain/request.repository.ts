import { Request } from '../infrastructure/entities/request.entity';

export interface RequestRepository {
  save(request: Request): Promise<Request>;
  // findAllByUserId(userId: number): Promise<Request[]>; // Lo haremos luego
}

export const RequestRepository = Symbol('RequestRepository');