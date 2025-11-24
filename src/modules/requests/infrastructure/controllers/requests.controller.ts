import { 
  Controller, Post, Body, UseGuards, Request, 
  HttpCode, HttpStatus 
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestService } from '../../application/create-request/create-request.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';

@Controller('requests')
@UseGuards(JwtAuthGuard) // Cualquier usuario logueado puede pedir
export class RequestsController {
  constructor(
    private readonly createRequest: CreateRequestService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRequestDto, @Request() req) {
    // req.user.id viene del token
    return this.createRequest.execute(dto, req.user.id);
  }
}