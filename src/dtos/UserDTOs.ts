import { Role } from '../entities/User';

export interface CreateUserDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface UserResponseDTO {
  id: string;
  nome: string;
  email: string;
  role: Role;
  createdAt: Date;
}
