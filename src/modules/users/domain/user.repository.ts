import { Serializable } from "child_process";
import { symbol } from "joi";
/*aqui definimos que es un usuario y lo que se puede hacer con el sin decir como */
export class UserDomain{
 id: number;
 email: string;
 //password_hash: string;
 nombre: string;
 apellido_paterno: string;
 apellido_materno: string;

}

export interface UserRepository{
    findAll():Promise<UserDomain[]>;

}
export const UserRepository = Symbol('UserRepository');