import { Router } from 'express';
import { SaleController } from '../controllers/saleController';

const router = Router();
const saleController = new SaleController();

router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);
router.post('/', saleController.createSale);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

export default router;