import { model, Schema } from 'mongoose';

export const Product = model('Product', new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  ingredients: {
    type: [{
      name: {
        type: String,
        required: true
      },
      icon: {
        type: String,
      },
    }]
  },
  ticketInfo: {
    eventName: String,
    eventDate: String,
    additionalInfo: String
  },
  hasStock: {
    type: Boolean,
    default: false
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}));
