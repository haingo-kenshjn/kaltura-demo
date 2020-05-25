import * as express from 'express';

import * as MediaController from '../controllers/mediaController';

const router = express.Router();
router.get('/', MediaController.getVideos);
router.get('/:id', MediaController.getVideoById);
router.post('/upload', MediaController.upload);

export default router;
