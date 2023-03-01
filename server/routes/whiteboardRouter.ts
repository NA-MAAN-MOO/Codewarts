import {
  getAllUsers,
  addMemo,
  updateMemo,
  getMemo,
  deleteMemo,
  changeMemoPos,
  participateInMemo,
} from '../controllers/whiteboardController';
import express from 'express';

const router = express.Router();

router.get('/user-infos', getAllUsers);

router.post('/add-memo', addMemo);
router.post('/delete-memo', deleteMemo);
router.post('/update-memo', updateMemo);
router.get('/get-memos', getMemo);
router.post('/change-memo-pos', changeMemoPos);
router.post('/participate-in-memo', participateInMemo);

export default router;
