import {
  sendUsersBojInfo,
  addMemo,
  updateMemo,
  getMemo,
  deleteMemo,
  changeMemoPos,
  participateInMemo,
  dropOutOfMemo,
  getUsersBojInfo,
  fetchBojInfos,
} from '../controllers/whiteboardController';
import express from 'express';

const router = express.Router();

router.get('/boj-infos', fetchBojInfos);
// send to client
// router.get('/user-rank', sendUsersBojInfo);

router.post('/add-memo', addMemo);
router.post('/delete-memo', deleteMemo);
router.post('/update-memo', updateMemo);
router.get('/get-memos', getMemo);
router.post('/change-memo-pos', changeMemoPos);
router.post('/participate-in-memo', participateInMemo);
router.post('/drop-out-of-memo', dropOutOfMemo);

export default router;
