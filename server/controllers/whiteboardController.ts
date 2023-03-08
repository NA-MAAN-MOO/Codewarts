import { Request, Response } from 'express';

import User from '../models/User';
import Memo from '../models/Memo';

import axios, { AxiosResponse } from 'axios';

export function getDate(): string {
  let dateNow = new Date();

  let fullYear = String(dateNow.getFullYear());
  let year = fullYear.substring(2, 4);
  let month = String(dateNow.getMonth() + 1);
  let day = String(dateNow.getDate());
  let hour = String(dateNow.getHours());
  let minute = String(dateNow.getMinutes());
  return year + '.' + month + '.' + day + '. ' + hour + ':' + minute;
}

// declare module 'node-cron';
const cron = require('node-cron');
// import cron from 'node-cron';

interface ResponseType {
  nickname: string;
  id: string;
  bojId: string;
  tier: number;
  maxStreak: number;
  solved: number;
}

let response: ResponseType[] = [];
const task = cron.schedule('*/10 * * * *', async () => {
  await getUsersBojInfo();
  console.log('가져온 랭킹 수', response.length);
});

// const task = cron.schedule('30 18 * * *', async () => {
//   await getUsersBojInfo();
//   console.log('가져온 랭킹 수', response.length);
// });

/* Get each user's data */
const getEachUserBojInfo = async (bojId: string) => {
  try {
    return await axios.get(
      `https://solved.ac/api/v3/user/show?handle=${bojId}`
    );
  } catch (e) {
    console.log(e);
    return false;
  }
};

/* Recreate response based on info through solved.ac api */
const regenerateData = async (datum: any) => {
  let result: ResponseType[] = [];
  for await (const data of datum) {
    const eachData: false | AxiosResponse<any, any> = await getEachUserBojInfo(
      data.userBojId
    );

    if (!!eachData) {
      result.push({
        nickname: data.userNickname,
        id: data.userId,
        bojId: data.userBojId,
        tier: eachData.data.tier,
        maxStreak: eachData.data.maxStreak,
        solved: eachData.data.solvedCount,
      });
    }
  }
  /* Error handling (too many requests) */
  if (result.length === 0) {
    console.log(`Ranking Update Failed`);
    return;
  }
  // return result;
  response = [...result];
};

/* Get all user's number of solved problems through boj ids in DB */
export const getUsersBojInfo = async () => {
  const datum = await User.find({});

  await regenerateData(datum);

  /* Sort by tier */
  if (response.length) {
    await response.sort((a, b) => b.tier - a.tier);
  }
};

/* When server starts, it brings boj infos */
getUsersBojInfo();

/* Send Boj Infos saved in heap(?) */
export const sendUsersBojInfo = (req: Request, res: Response) => {
  // console.log(response, 'sendUsersBojInfo');
  if (response.length === 0) {
    res.status(404).send('No valid Boj Users Id');
  } else {
    res.status(200).send(response);
  }
};

// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const datum = await User.find({});
//     res.status(200).send(datum);
//     // console.log(datum);
//   } catch (e) {
//     console.error(e);
//     res.status(404).send('No valid Boj Users Id');
//   }
// };

/* Save memo to DB */
export const addMemo = async (req: Request, res: Response) => {
  const memo = new Memo({
    date: getDate(),
    authorId: req.body.authorId,
    authorNickname: req.body.authorNickname,
    content: '',
    x: 0.3,
    y: 0.2,
  });

  try {
    const result = await memo.save();
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: '메모 추가 실패' });
  }
};

/* Get all memos in DB */
export const getMemo = async (req: Request, res: Response) => {
  try {
    const datum = await Memo.find({});
    res.status(200).json(datum);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: '메모 불러오기 실패' });
  }
};

/* Change memo content */
export const updateMemo = async (req: Request, res: Response) => {
  try {
    const objectId = req.body._id;
    let result = await Memo.updateOne(
      { _id: objectId },
      { content: req.body.content }
    );
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: '메모 수정 실패' });
  }
};

/* Change memo position */
export const changeMemoPos = async (req: Request, res: Response) => {
  try {
    // const objectId = new Types.ObjectId(req.body._id);
    const objectId = req.body._id;
    const result = await Memo.updateOne(
      { _id: objectId },
      { x: req.body.x, y: req.body.y }
    );
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: '메모 위치 수정 실패' });
  }
};

export const participateInMemo = async (req: Request, res: Response) => {
  try {
    const objectId = req.body._id;
    const targetUser = req.body.target;

    const targetMemo = await Memo.findOne({ _id: objectId });
    let newParticipants = targetMemo?.participants;

    newParticipants?.push(targetUser);

    const result = await Memo.updateOne(
      { _id: objectId },
      { participants: newParticipants }
    );
    // console.log(newParticipants);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: '참여 실패' });
  }
};

export const dropOutOfMemo = async (req: Request, res: Response) => {
  try {
    const objectId = req.body._id;
    const targetUser = req.body.target;

    const targetMemo = await Memo.findOne({ _id: objectId });
    let prevParticipants = targetMemo?.participants;

    let newParticipants = prevParticipants?.filter((participant: string) => {
      return participant !== targetUser;
    });

    const result = await Memo.updateOne(
      { _id: objectId },
      { participants: newParticipants }
    );
    // console.log(newParticipants);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: '체크 해제 실패' });
  }
};

/* Delete a memo */
export const deleteMemo = async (req: Request, res: Response) => {
  try {
    const objectId = req.body._id;

    const result = await Memo.deleteOne({ _id: objectId });
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: '삭제 실패' });
  }
  // await Memo.remove({ _id: objectId });
};
