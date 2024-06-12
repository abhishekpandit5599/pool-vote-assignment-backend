import { Router } from 'express';
import authRoutes from './authRoutes';
import poolRoutes from './poolRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pool', poolRoutes);

export default router;