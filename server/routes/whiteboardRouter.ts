import {
  getUsersBojInfo,
  addMemo,
  updateMemo,
  getMemo,
  deleteMemo,
} from '../controllers/whiteboardController';
import express from 'express';

const router = express.Router();

router.get('/boj-infos', getUsersBojInfo);
router.get('/add-memo', addMemo);
router.get('/delete-memo', deleteMemo);
router.get('/update-memo', updateMemo);
router.get('/get-memos', getMemo);

export default router;
