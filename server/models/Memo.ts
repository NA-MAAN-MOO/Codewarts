import { Schema, model, Document, Model, Types } from 'mongoose';

interface ParticipantType {
  memoId: Types.ObjectId;
  userId: string;
  userNickname: string;
  tier: number;
}

export interface IMemoInfo {
  date: Date;
  authorId: string;
  authorNickname: string;
  content: string;
  x: number;
  y: number;
  participants: ParticipantType[];
}

const memo = new Schema<IMemoInfo>({
  date: { type: Date, default: Date.now, required: false },
  authorId: { type: String, required: true },
  authorNickname: { type: String, required: true },
  content: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  participants: [Object],
});

const Memo = model<IMemoDocument>('memo', memo);

export interface IMemoDocument extends IMemoInfo, Document {}
export interface IMemoModel extends Model<IMemoDocument> {}
export default Memo;
