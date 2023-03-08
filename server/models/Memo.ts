import { Schema, model, Document, Model, Types } from 'mongoose';
require('moment-timezone');
var moment = require('moment');
moment.tz.setDefault('Asia/Seoul');

export function getDate(): string {
  // let dateNow = new Date();
  // let fullYear = String(dateNow.getFullYear());
  // let year = fullYear.substring(2, 4);
  // let month = String(dateNow.getMonth() + 1);
  // let day = String(dateNow.getDate());
  // let hour = String(dateNow.getHours());
  // let minute = String(dateNow.getMinutes());
  let fullYear = String(moment().years());
  let year = fullYear.substring(2, 4);
  let month = String(moment().months() + 1);
  let day = String(moment().date());
  let hour = String(moment().hour());
  let minute = String(moment().minute());
  return year + '.' + month + '.' + day + '. ' + hour + ':' + minute;
}

export interface IMemoInfo {
  date: string;
  authorId: string;
  authorNickname: string;
  content: string;
  x: number;
  y: number;
  participants: string[];
}

const memo = new Schema<IMemoInfo>({
  date: { type: String, default: getDate(), required: false },
  authorId: { type: String, required: true },
  authorNickname: { type: String, required: true },
  content: { type: String },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  participants: [Object],
});

const Memo = model<IMemoDocument>('memo', memo);

export interface IMemoDocument extends IMemoInfo, Document {}
export interface IMemoModel extends Model<IMemoDocument> {}
export default Memo;
