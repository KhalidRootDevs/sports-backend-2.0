import { Router } from 'express';
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  deleteNotification,
  deleteAllNotifications,
} from './controller';
import { authenticate, authorizeRoles } from '../../middlewares/authenticate';
import { UserRole } from '../user/model';

const router = Router();

router.post('/create', createNotification);
router.get('/all', authenticate, getAllNotifications);
router.get('/find/:id', authenticate, getNotificationById);
router.delete('/delete/:id', authenticate, deleteNotification);
router.delete(
  '/deleta-all',
  authenticate,
  authorizeRoles([UserRole.ADMIN, UserRole.MODERATOR]),
  deleteAllNotifications
);

export default router;
