export class ServiceDomain {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // --- CAMBIOS AQUÍ ---
  // Agregamos '?' y '| null' para que acepte nulos sin dar error
  createdBy?: number | null; 
  serviceTypeId?: number | null;
 serviceType?: { 
    id: number; 
    name: string; 
  };
  // --------------------
}

export interface ServiceRepository {
  save(service: Partial<ServiceDomain>): Promise<ServiceDomain>;
  findAll(): Promise<ServiceDomain[]>;
  findById(id: number): Promise<ServiceDomain | null>;
  delete(id: number): Promise<void>;
}

export const ServiceRepository = Symbol('ServiceRepository');