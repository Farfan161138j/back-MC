import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// --- IMPORTS ---
// Si alguna ruta te marca rojo, usa el truco de borrar la línea y Ctrl + .
import { Request } from '../../infrastructure/entities/request.entity';
import { Product } from '../../../products/infrastructure/entities/product.entity';
import { UpdateRequestStatusDto } from '../../infrastructure/controllers/dto/update-request-status.dto';

@Injectable()
export class UpdateRequestStatusService {
  
  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>, 
  ) {}

  async execute(requestId: number, dto: UpdateRequestStatusDto): Promise<Request> {
    
    // 1. Buscar la solicitud
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['items', 'items.product', 'status'], 
    });

    if (!request) {
      throw new NotFoundException(`Solicitud #${requestId} no encontrada`);
    }

    // 2. Lógica de Negocio (Resta de Stock)
    const ID_APROBADO = 4; // Ajusta este ID si en tu SQL 'Aprobado' es otro número
    
    // Si cambiamos a Aprobado y NO estaba ya aprobado...
    if (dto.statusId === ID_APROBADO && request.status.id !== ID_APROBADO) {
      
      for (const item of request.items) {
        
        // Si es un producto (no un servicio)
        if (item.product) {
          const product = item.product;

          // --- CORRECCIÓN: Usamos los nombres en inglés de tu Entidad ---

          // A. Validar Stock
          if (product.availableQuantity < item.quantity) {
              throw new BadRequestException(
                `No hay suficiente stock del producto "${product.name}". Disponibles: ${product.availableQuantity}, Solicitados: ${item.quantity}`
              );
          }

          // B. Restar Inventario
          product.availableQuantity -= item.quantity; 
          product.soldQuantity += item.quantity;    

          // C. Guardar
          await this.productRepo.save(product);
        }
      }
    }

    // 3. Actualizar Estado
    // Usamos 'id' porque así se llama la propiedad en la clase RequestStatus (aunque en BD sea id_estado_solicitud)
    request.status = { id: dto.statusId } as any; 
    
    return this.requestRepo.save(request);
  }
}