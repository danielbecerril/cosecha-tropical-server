import { Router } from 'express';
import { ClientController } from '../controllers/clientController';

const router = Router();
const clientController = new ClientController();

router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;