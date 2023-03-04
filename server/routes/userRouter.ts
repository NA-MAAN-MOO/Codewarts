import express from 'express';
import { signUp, login, getChar } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.get('/get-char/:username', getChar);

export default router;
