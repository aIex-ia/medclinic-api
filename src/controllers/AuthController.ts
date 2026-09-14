import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO, LoginDTO } from '../dtos/UserDTOs';

const authService = new AuthService();

export class AuthController {
  async register(req: Request<{}, {}, CreateUserDTO>, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request<{}, {}, LoginDTO>, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
