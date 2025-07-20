import { Router } from 'express';
import clientRoutes from './clientRoutes';
import productRoutes from './productRoutes';
import saleRoutes from './saleRoutes';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication middleware to all protected routes
router.use('/clients', authMiddleware, clientRoutes);
router.use('/products', authMiddleware, productRoutes);
router.use('/sales', authMiddleware, saleRoutes);

// Health check endpoint (no authentication required)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  });
});

export default router;