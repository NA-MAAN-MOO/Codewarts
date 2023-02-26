/* Use env variable */
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';

const { MongoClient } = require('mongodb');
import { ObjectId } from 'mongoose';
const mongoPassword = process.env.MONGO_PW;

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
  rating: number;
  maxStreak: number;
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
const regenerateData = async (datum: DatumType[]) => {
  for await (const data of datum) {
    // console.log(data);
    const eachData: false | AxiosResponse<any, any> = await getEachUserBojInfo(
      data.userBojId
    );
    // console.log(eachData.data);

    if (!!eachData) {
      response.push({
        nickname: data.userNickname,
        id: data.userId,
        bojId: data.userBojId,
        tier: eachData.data.tier,
        rating: eachData.data.rating,
        maxStreak: eachData.data.maxStreak,
      });
    }
  }
};

/* Get all user's number of solved problems through boj ids in DB */
export const getUsersBojInfo = async (req: Request, res: Response) => {
  const uri = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  /* Connect to DB */
  const dbconnect = async () => {
    try {
      await client.connect();
      console.log('Connected to DB to get boj infos from all users');
    } catch (e) {
      console.error(e);
    }
  };

  await dbconnect();

  const db = client.db('codewart');
  const collection = db.collection('users');

  /* Get all users' datum in the DB */
  const datum = await collection
    .find({}, { _id: false, userBojId: true, userNickname: true, userId: true })
    .toArray();

  await regenerateData(datum);

  /* Send response */
  if (response.length === 0) {
    res.status(404).send('No valid Boj Users Id');
  } else {
    res.status(200).send(response);
  }

  /* Empty data */
  response = [];
};
