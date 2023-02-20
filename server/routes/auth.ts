import express from 'express';
import { signUp, login } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);
