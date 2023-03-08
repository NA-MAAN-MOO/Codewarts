import { Schema, model, Document, Model, Types } from 'mongoose';

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
  date: { type: String, required: false },
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
