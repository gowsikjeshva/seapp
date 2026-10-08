import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { listCustomers, listDrivers } from '../controllers/userController.js';
const router = Router(); router.get('/customers', protect, authorize('courier_staff', 'admin'), listCustomers); router.get('/drivers', protect, authorize('courier_staff', 'admin'), listDrivers); export default router;
