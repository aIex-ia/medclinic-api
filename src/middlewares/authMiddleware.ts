import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { Role } from '../entities/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token não informado', 401));
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return next(new AppError('Erro no token', 401));
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return next(new AppError('Token mal formatado', 401));
  }

  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    return next(new AppError('JWT_SECRET não configurado no ambiente', 500));
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string; role: Role };
    req.user = decoded;
    return next();
  } catch (err) {
    return next(new AppError('Token inválido ou expirado', 401));
  }
};
