import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDTO, LoginDTO, UserResponseDTO } from '../dtos/UserDTOs';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(data: CreateUserDTO): Promise<UserResponseDTO> {
    const { nome, email, senha } = data;

    if (!nome || !email || !senha) {
      throw new AppError('Nome, e-mail e senha são obrigatórios', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Formato de e-mail inválido', 400);
    }

    const userExists = await UserRepository.findOneBy({ email });
    if (userExists) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = UserRepository.create({
      nome,
      email,
      senha: hashedPassword,
    });

    await UserRepository.save(newUser);

    return {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
  }

  async login(data: LoginDTO): Promise<{ token: string; user: UserResponseDTO }> {
    const { email, senha } = data;

    if (!email || !senha) {
      throw new AppError('E-mail e senha são obrigatórios', 400);
    }

    const user = await UserRepository.findOneBy({ email });
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const secret = process.env.JWT_SECRET || 'supersecret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn }
    );

    const userResponse: UserResponseDTO = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return { token, user: userResponse };
  }
}
