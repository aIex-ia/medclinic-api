import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { Role } from '../entities/User';

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
  '/ping',
  authMiddleware,
  roleMiddleware([Role.ADMINISTRADOR]),
  adminController.ping
);

export { adminRoutes };
