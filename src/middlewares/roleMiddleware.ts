import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { AppError } from '../utils/AppError';
import { Role } from '../entities/User';

export const roleMiddleware = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuário não autenticado', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Sem permissão para acessar este recurso', 403));
    }

    return next();
  };
};
