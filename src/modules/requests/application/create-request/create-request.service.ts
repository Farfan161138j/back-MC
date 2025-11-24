import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { RequestRepository } from '../../domain/request.repository';
import { CreateRequestDto } from '../../infrastructure/controllers/dto/create-request.dto';
import { Request } from '../../infrastructure/entities/request.entity';
import { RequestItem } from '../../infrastructure/entities/request-item.entity';

@Injectable()
export class CreateRequestService {
  constructor(
    @Inject(RequestRepository)
    private readonly repository: RequestRepository,
  ) {}

  async execute(dto: CreateRequestDto, userId: number): Promise<Request> {
    
    // 1. Instanciamos la solicitud
    const newRequest = new Request();
    newRequest.clientMessage = dto.clientMessage;
    newRequest.user = { id_usuario: userId } as any; // Vinculamos al usuario logueado
    newRequest.status = { id: 1 } as any; // ID 1 = "Pendiente" (Default)

    // 2. Mapeamos los items
    // Convertimos el DTO items a Entidades RequestItem
    newRequest.items = dto.items.map(itemDto => {
      const itemEntity = new RequestItem();
      itemEntity.quantity = itemDto.quantity;

      // Validar: Debe tener producto O servicio, no ambos vacíos
      if (!itemDto.productId && !itemDto.serviceId) {
         throw new BadRequestException('Cada item debe tener un productId o un serviceId');
      }

      if (itemDto.productId) {
        itemEntity.product = { id: itemDto.productId } as any;
      }
      
      if (itemDto.serviceId) {
        itemEntity.service = { id: itemDto.serviceId } as any;
      }

      return itemEntity;
    });

    // 3. Guardamos (TypeORM usará Cascade para guardar los items automáticamente)
    return this.repository.save(newRequest);
  }
}