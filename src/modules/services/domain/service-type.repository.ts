import { ServiceDomain } from './service.repository';


export class ServiceTypeDomain {
  id: number;
  name: string;
  services?: ServiceDomain[];
}

export interface ServiceTypeRepository {
  save(name: string): Promise<ServiceTypeDomain>;
  findAll(): Promise<ServiceTypeDomain[]>;
  delete(id: number): Promise<void>;
}

export const ServiceTypeRepository = Symbol('ServiceTypeRepository');