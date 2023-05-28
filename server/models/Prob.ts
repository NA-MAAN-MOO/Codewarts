import { Schema, model, Document, Model } from 'mongoose';
import { IProbInfo } from '../controllers/propTypes';
const mongoosePaginate = require('mongoose-paginate-v2');

const probdata = new Schema<IProbInfo>({
  probId: {
    type: Number,
  },
  prob_desc: {
    type: String,
  },
  prob_input: {
    type: String,
  },
  prob_output: {
    type: String,
  },
  samples: {
    type: Object,
  },
  source: {
    type: String,
  },
  solvedAC: {
    type: Object,
  },
});

probdata.plugin(mongoosePaginate);

const Prob = model<IProbDocument>('prob', probdata);

export interface IProbDocument extends IProbInfo, Document {}
export interface IProbModel extends Model<IProbDocument> {}
export { probdata, Prob };
