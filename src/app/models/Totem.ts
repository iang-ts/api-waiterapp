import { model, Schema } from 'mongoose';

export const Totem = model('Totem', new Schema({
  name: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true,
    unique: true
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  location: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastConnection: {
    type: Date,
    default: Date.now
  }
}));
