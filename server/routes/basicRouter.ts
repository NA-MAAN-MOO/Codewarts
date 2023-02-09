import express from 'express';
import { createRoom, origin } from '../controllers/editorController';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ msg: "I'm alive" });
});

export default router;
