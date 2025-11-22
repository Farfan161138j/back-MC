export class CategoryDomain {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRepository {
  // Crear o Editar
  save(category: Partial<CategoryDomain>): Promise<CategoryDomain>;

  // Leer
  findAll(): Promise<CategoryDomain[]>; // Las categorías suelen ser pocas, quizá no urgela paginación aún
  findById(id: number): Promise<CategoryDomain | null>;
  findByName(name: string): Promise<CategoryDomain | null>; // Importante para no repetir nombres

  // Borrar
  delete(id: number): Promise<void>;
}

export const CategoryRepository = Symbol('CategoryRepository');