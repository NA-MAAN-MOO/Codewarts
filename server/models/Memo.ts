import { Schema, model, Document, Model } from 'mongoose';

export interface IMemoInfo {
  date: string;
  authorId: string;
  content: string;
  x: number;
  y: number;
}

const memo = new Schema<IMemoInfo>({
  date: { type: String, required: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const Memo = model<IMemoDocument>('memo', memo);

export interface IMemoDocument extends IMemoInfo, Document {}
export interface IMemoModel extends Model<IMemoDocument> {}
export default Memo;
