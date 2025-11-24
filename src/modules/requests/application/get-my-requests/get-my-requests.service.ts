import { Injectable, Inject } from '@nestjs/common';
import { RequestRepository } from '../../domain/request.repository';
import { Request } from '../../infrastructure/entities/request.entity';

@Injectable()
export class GetMyRequestsService {
  constructor(
    @Inject(RequestRepository)
    private readonly repository: RequestRepository,
  ) {}

  async execute(userId: number): Promise<Request[]> {
    return this.repository.findByUserId(userId);
  }
}