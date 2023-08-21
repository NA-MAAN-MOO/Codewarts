import { Request, Response } from 'express';

import User from '../models/User';
import Memo from '../models/Memo';
import BojInfo from '../models/BojInfo';

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

interface ResponseType {
  nickname: string;
  userId: string;
  bojId: string;
  tier: number;
  maxStreak: number;
  solved: number;
}

let response: ResponseType[] = [];

/* Get each user's data */
const getEachUserBojInfo = async (data: any) => {
  try {
    const bojInfo = await axios.get(
      `https://solved.ac/api/v3/user/show?handle=${data.userBojId}`
    );

    const eachData = {
      nickname: data.userNickname,
      userId: data.userId,
      bojId: data.userBojId,
      tier: bojInfo.data.tier,
      maxStreak: bojInfo.data.maxStreak,
      solved: bojInfo.data.solvedCount,
    };

    return eachData;
  } catch (e) {
    // console.log(e);
    return false;
  }
};

/* Get all user's number of solved problems through boj ids in DB */
export const getUsersBojInfo = async (req: Request, res: Response) => {
  const datum = await User.find({});
  const promises = datum.map(getEachUserBojInfo);
  let result = await Promise.allSettled(promises);
  //TODO: elem type 변경하기
  result = result.filter((elem: any) => {
    return elem.value !== false;
  });

  const resultData = result.map((elem: any) => {
    const { nickname, id, bojId, tier, maxStreak, solved } = elem.value;
    return { nickname, id, bojId, tier, maxStreak, solved };
  });

  // console.log(resultData);

  if (resultData.length) {
    resultData.sort((a, b) => b.tier - a.tier);
    res.status(200).send(resultData);
  } else {
    res.status(404).send('No valid boj users id!');
  }
};

/* Send Boj Infos saved in heap(?) */
export const sendUsersBojInfo = (req: Request, res: Response) => {
  if (response.length === 0) {
    res.status(404).send('No valid Boj Users Id');
  } else {
    res.status(200).send(response);
  }
};

/* Save Boj Infos in DB */
export const saveUsersBojInfo = async () => {
  const users = await User.find({});

  for (let user of users) {
    const eachData = await getEachUserBojInfo(user);

    if (eachData) {
      const bojInfo = new BojInfo({ ...eachData });

      try {
        await bojInfo.save();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

export const addBojInfo = async (req: Request, res: Response) => {
  try {
    const bojId = req.body.bojId;
    const result = await getEachUserBojInfo(bojId);

    if (result) {
      const bojInfo = new BojInfo(result);
      const response = bojInfo.save();
      res.status(200).json(response);
    } else {
      res.status(200).json({
        message:
          '가입은 완료되었지만, 백준 ID가 유효하지 않아 랭킹 확인은 어렵습니다.',
      });
    }
  } catch (e) {
    console.error(e);
  }
};

/* Get users bojInfo from DB and send it to client */
export const fetchBojInfos = async (req: Request, res: Response) => {
  try {
    const result = await BojInfo.find({});
    result.sort((a, b) => b.tier - a.tier);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: '백준 랭킹 불러오기 실패' });
  }
};

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
};
