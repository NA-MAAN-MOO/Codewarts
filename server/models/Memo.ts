import { Schema, model, Document, Model } from 'mongoose';

interface ParticipantType {
  userId: string;
  userNickname: string;
  tier: number;
}

export interface IMemoInfo {
  date: string;
  authorId: string;
  content: string;
  x: number;
  y: number;
  participants: ParticipantType[];
}

const memo = new Schema<IMemoInfo>({
  date: { type: String, required: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  //TODO: type error 고치기
  participants: { type: Array, required: false },
});

const Memo = model<IMemoDocument>('memo', memo);

export interface IMemoDocument extends IMemoInfo, Document {}
export interface IMemoModel extends Model<IMemoDocument> {}
export default Memo;
