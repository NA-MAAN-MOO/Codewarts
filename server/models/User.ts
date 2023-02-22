// import { config } from '../envconfig';
import { Schema, model, Document, Model } from 'mongoose';
import { IUserInfo } from '../controllers/userTypes';

// const bcrypt = require('bcrypt');
// const saltRounds = config.bcrypt.saltRounds;

const user = new Schema<IUserInfo>({
  userId: { type: String, required: true, unique: true },
  userPw: { type: String, required: true },
  userNickname: { type: String, required: true, unique: true },
  userBojId: { type: String, required: true },
  userLeetId: { type: String, required: false },
});

const User = model<IUserDocument>('user', user);
// create new User document

export interface IUserDocument extends IUserInfo, Document {}
export interface IUserModel extends Model<IUserDocument> {}
export default User;
