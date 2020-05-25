import * as express from 'express';

import * as notificationController from '../controllers/notificationController';

const router = express.Router();

router.post('/', notificationController.notification);

export default router;
