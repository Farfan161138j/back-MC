// src/modules/products/domain/product.repository.ts

// 1. Definimos la clase pura (sin decoradores de TypeORM)
export class ProductDomain {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  image: string;
  soldQuantity: number;
  availableQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number; // Aquí solo guardaremos el ID del usuario por simplicidad en el dominio
}

// 2. Definimos el Contrato (Interfaz)
// Esto le dice al "Obrero" qué herramientas debe tener listas.
export interface ProductRepository {
  
  // Crear o Actualizar
  save(product: Partial<ProductDomain>): Promise<ProductDomain>;

  // Leer
  findAll(page: number, limit: number): Promise<ProductDomain[]>; // Añadimos paginación básica opcional
  findById(id: number): Promise<ProductDomain | null>;
  
  // Buscar por nombre (útil para evitar duplicados)
  findByName(name: string): Promise<ProductDomain | null>;

  // Borrar
  delete(id: number): Promise<void>;
}

// Token para la Inyección de Dependencias (lo usaremos en el Module)
export const ProductRepository = Symbol('ProductRepository');