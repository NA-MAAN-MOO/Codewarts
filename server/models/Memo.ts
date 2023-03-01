import { Schema, model, Document, Model, Types } from 'mongoose';

export function getDate(): string {
  let dateNow = new Date();
  let fullYear = String(dateNow.getFullYear());
  let year = fullYear.substring(2, 4);
  let month = String(dateNow.getMonth());
  let day = String(dateNow.getDay());
  let hour = String(dateNow.getHours());
  let minute = String(dateNow.getMinutes());
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
