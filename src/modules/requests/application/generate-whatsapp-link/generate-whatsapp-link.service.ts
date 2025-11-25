import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from '../../infrastructure/entities/request.entity';

@Injectable()
export class GenerateWhatsappLinkService {
  constructor(private configService: ConfigService) {}

  execute(request: Request): string {
    // 1. Número de la empresa (Dueño)
    const phone = this.configService.get<string>('WHATSAPP_PHONE');
    
    // 2. Datos del Cliente (extraídos del usuario que hizo el pedido)
    const user = request.user;

    // --- CONSTRUCCIÓN DEL MENSAJE ---

    // A. Encabezado (ID y Fecha)
    let message = `👋 *NUEVO PEDIDO #${request.id}*\n`;
    message += `📅 Fecha: ${new Date().toLocaleDateString()}\n`;
    message += `──────────────────\n`; // Separador visual

    // B. Ficha del Cliente (Nombre, Tel, Correo)
    message += `👤 *DATOS DEL CLIENTE:*\n`;
    
    // Unimos nombre y apellido (manejando si apellido es opcional)
    // NOTA: Si en tu Entidad User la propiedad se llama 'name', cambia 'user.nombre' por 'user.name'
    const nombreCompleto = `${user.nombre} ${user.apellidoPaterno || ''}`.trim();
    
    message += `• Nombre: ${nombreCompleto}\n`;
    message += `• Tel: ${user.whatsappNumber || 'No registrado'}\n`;
    message += `• Email: ${user.email}\n`;
    message += `──────────────────\n`;

    // C. Lista de Productos y Servicios
    message += `📋 *DETALLE DEL PEDIDO:*\n`;

    request.items.forEach((item) => {
      const qty = item.quantity;
      let itemName = 'Item';

      // Validación para obtener el nombre correcto
      if (item.product) {
        itemName = item.product.name; // Nombre del producto
      } else if (item.service) {
        itemName = item.service.name; // Nombre del servicio
      }
      
      message += `👉 (${qty}) ${itemName}\n`;
    });

    // D. Nota del Cliente (Solo si existe)
    if (request.clientMessage) {
      message += `──────────────────\n`;
      message += `💬 *NOTA DEL CLIENTE:*\n`;
      message += `${request.clientMessage}\n`;
    }

    // E. Cierre
    message += `\n✅ *Solicito confirmación y método de pago.*`;

    // 3. Codificar para URL
    const encodedMessage = encodeURIComponent(message);

    // 4. Retornar el link
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }
}