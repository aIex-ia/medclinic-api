import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/AppError';
import { UserResponseDTO } from '../dtos/UserDTOs';

/**
 * Controller responsável por lidar com requisições relacionadas a usuários.
 */
export class UserController {
  /**
   * Retorna os dados do usuário autenticado no momento.
   */
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Usuário não identificado', 401);
      }

      const user = await UserRepository.findOneBy({ id: userId });

      if (!user) {
        throw new AppError('Usuário não encontrado', 404);
      }

      const userResponse: UserResponseDTO = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };

      return res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  }
}
