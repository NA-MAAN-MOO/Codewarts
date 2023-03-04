import express from 'express';
import { signUp, login, getChar, logout } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.get('/get-char/:username', getChar);

router.post('/logout', logout);

export default router;
