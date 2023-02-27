import { Request, Response } from 'express';

import { ObjectId } from 'mongoose';
import User from '../models/User';
import Memo from '../models/Memo';

import axios, { AxiosResponse } from 'axios';

interface DatumType {
  _id: ObjectId;
  userId: string;
  userPw: string;
  userNickname: string;
  userBojId: string;
  userLeetId: string;
}

interface ResponseType {
  nickname: string;
  id: string;
  bojId: string;
  tier: number;
  maxStreak: number;
  solved: number;
}

let response: ResponseType[] = [];

/* Get each user's data */
const getEachUserBojInfo = async (bojId: string) => {
  try {
    return await axios.get(
      `https://solved.ac/api/v3/user/show?handle=${bojId}`
    );
  } catch (e) {
    return false;
  }
};

/* Recreate response based on info through solved.ac api */
const regenerateData = async (datum: any) => {
  for await (const data of datum) {
    // console.log(data);
    const eachData: false | AxiosResponse<any, any> = await getEachUserBojInfo(
      data.userBojId
    );

    if (!!eachData) {
      response.push({
        nickname: data.userNickname,
        id: data.userId,
        bojId: data.userBojId,
        tier: eachData.data.tier,
        maxStreak: eachData.data.maxStreak,
        solved: eachData.data.solvedCount,
      });
    }
  }
};

/* Get all user's number of solved problems through boj ids in DB */
export const getUsersBojInfo = async (req: Request, res: Response) => {
  const datum = await User.find({});

  await regenerateData(datum);

  /* Sort by tier */
  if (response.length) {
    await response.sort((a, b) => b.tier - a.tier);
  }

  /* Send response */
  if (response.length === 0) {
    res.status(404).send('No valid Boj Users Id');
  } else {
    res.status(200).send(response);
  }

  /* Empty data */
  response = [];
};

/* Save memo to DB */
export const fetchMemo = async (req: Request, res: Response) => {
  const memo = new Memo({
    date: req.body.date,
    authorId: req.body.authorId,
    content: req.body.content,
    x: req.body.x,
    y: req.body.y,
  });

  memo
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((e) => {
      console.error(e);
      res.status(400).json({ message: '메모 저장 실패' });
    });
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
export const changeMemo = async (req: Request, res: Response) => {
  await Memo.updateOne({ _id: req.params.id }, { content: req.body.content })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((e) => {
      console.error(e);
      res.status(400).json({ message: '메모 수정 실패' });
    });
};
