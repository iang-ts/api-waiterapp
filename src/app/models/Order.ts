import { model, Schema } from 'mongoose';

export const Order = model('Order', new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['WAITING', 'IN_PRODUCTION', 'DONE',],
    default: 'WAITING'
  },
  account: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Account'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD', 'PIX'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING'
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String
  },
  products: {
    required: true,
    type: [{
      product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }]
  },
  // Para controle de impressão
  printed: {
    type: Boolean,
    default: false
  },
  printedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}));
