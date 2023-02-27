import { getUsersBojInfo } from '../controllers/whiteboardController';
import express from 'express';

const router = express.Router();

router.get('/', getUsersBojInfo);

export default router;
