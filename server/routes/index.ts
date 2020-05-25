import * as express from 'express';
import meidaRoutes from './media';
import notificationRoutes from './notification';

const router = express.Router();

router.use('/media', meidaRoutes);
router.use('/notification', notificationRoutes);

export default router;
