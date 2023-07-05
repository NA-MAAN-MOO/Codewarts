import express from 'express';
import {
  signUp,
  login,
  getChar,
  validate,
} from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);

router.post('/validate', validate);

router.post('/login', login);

router.get('/get-char/:username', getChar);

export default router;
