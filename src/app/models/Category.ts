import { model, Schema } from 'mongoose';

export const Category = model('Category', new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}));
