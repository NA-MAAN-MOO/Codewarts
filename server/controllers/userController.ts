import { Request, Response } from 'express';
// const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
const AUTH_ERROR = { message: '사용자 인증 오류' };
import { Token } from '../controllers/userTypes';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import { IUserInfo } from './userTypes';
import CharInfo from '../services/CharInfo';

// async function hashPassword(user: IUserInfo) {
//   const password = user.userPw;
//   // const saltRounds = config.bcrypt.saltRounds;

//   const hashedPassword = await new Promise((resolve, reject) => {
//     bcrypt.hash(password, saltRounds, function (err: any, hash: any) {
//       if (err) reject(err);
//       resolve(hash);
//     });
//   });

//   return hashedPassword;
// }

export const signUp = async (req: Request, res: Response) => {
  try {
    console.log('signup');
    const user = req.body;

    const foundUserById = await User.findOne({ userId: user.userId });
    if (foundUserById) {
      return res.status(409).json({
        status: 409,
        message: '이미 존재하는 아이디입니다.',
      });
    }
    const foundUserByNick = await User.findOne({
      userNickname: user.userNickname,
    });
    if (foundUserByNick) {
      return res.status(409).json({
        status: 409,
        message: '이미 존재하는 닉네임입니다.',
      });
    }

    // user.userPw = await hashPassword(user);
    const result = await User.collection.insertOne({
      userId: user.userId,
      userPw: user.userPw,
      userNickname: user.userNickname,
      userBojId: user.userBojId,
      userLeetId: user.userLeetId,
    });
    if (!result) {
      return res.json({ success: false, message: '회원가입 실패' });
    }
    return res.status(200).json({
      status: 200,
      payload: {
        userId: user.userId,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const login = async (req: Request, res: Response) => {
  // * Validate user input
  if (!req.body.userId) {
    return res.status(400).json({
      status: 400,
      message: '아이디를 입력해주세요.',
    });
  }
  if (!req.body.userPw) {
    return res.status(400).json({
      status: 400,
      message: '비밀번호를 입력해주세요.',
    });
  }
  const { userId, userPw } = req.body;

  const foundUser = await User.findOne({ userId: userId });
  if (!foundUser) {
    console.log('nofound');
    return res.status(400).json({
      status: 400,
      message: '아이디를 확인해주세요.',
    });
  }

  const isPasswordCorrect = await User.findOne({
    userId: userId,
    userPw: userPw,
  });

  if (isPasswordCorrect) {
    res.status(200).json({
      status: 200,
      payload: {
        userId: foundUser.userId,
        userNickname: foundUser.userNickname,
        userBojId: foundUser.userBojId,
        userLeetId: foundUser.userLeetId,
      },
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: '비밀번호가 올바르지 않습니다.',
    });
  }
};

export const getChar = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;

    if (!CharInfo.get(username)) {
      //CharInfo에 username이 없음 => 오픈비두 서버에는 있는 username이지만, 현재 서버에는 없는 유저임.
      //에러 처리하지 않고, 그냥 빈칸 처리
      return res.send('');
    }
    res.send(CharInfo.get(username));
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
// const isPasswordCorrect = await bcrypt.compare(userPw, foundUser.userPw);
// if (isPasswordCorrect) {
//   const accessToken = jwt.sign(
//     {
//       userId: foundUser.userId,
//       username: foundUser.userNickname,
//       uuid: uuidv4(),
//     },
//     config.jwt.secretKey,
//     {
//       expiresIn: '1h',
//     }
//   );

//   const refreshToken = jwt.sign(
//     {
//       userId: foundUser.userId,
//       username: foundUser.userNickname,
//       uuid1: uuidv4(),
//       uuid2: uuidv4(),
//     },
//     config.jwt.secretKey
//   );

//   await User.collection.updateOne(
//     { userId: foundUser.userId },
//     {
//       $set: {
//         refreshToken: refreshToken,
//         lastUpdated: new Date(),
//       },
//     }
//   );

//   res.cookie('refreshToken', refreshToken, { path: '/', secure: true }); // 60초 * 60분 * 1시간
//   res.status(200).json({
//     status: 200,
//     payload: {
//       userId: foundUser.userId,
//       accessToken: accessToken,
//     },
//   });
// } else {
//   return res.status(400).json({
//     status: 400,
//     message: '비밀번호가 올바르지 않습니다.',
//   });
// }
