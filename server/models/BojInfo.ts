import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IBojInfo {
  nickname: string;
  userId: string;
  bojId: string;
  tier: number;
  maxStreak: number;
  solved: number;
}

const bojInfo = new Schema<IBojInfo>({
  nickname: { type: String, required: true },
  userId: { type: String, required: true },
  bojId: { type: String, required: true },
  tier: { type: Number, required: true },
  maxStreak: { type: Number, required: true },
  solved: { type: Number, required: true },
});

const BojInfo = model<IBojInfoDocument>('bojInfo', bojInfo);

export interface IBojInfoDocument extends IBojInfo, Document {}
export interface IBojInfoModel extends Model<IBojInfoDocument> {}
export default BojInfo;
