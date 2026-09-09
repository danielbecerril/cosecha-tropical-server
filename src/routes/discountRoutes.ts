import { Router } from 'express';
import { DiscountController } from '../controllers/discountController';

const router = Router();
const discountController = new DiscountController();

router.get('/', discountController.getAllDiscounts);
router.get('/:id', discountController.getDiscountById);
router.post('/', discountController.createDiscount);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);

export default router;
