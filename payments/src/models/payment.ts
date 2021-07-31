import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPayment {
  orderId: string;
  stripeId: string;
}

interface IPaymentDoc extends Document {
  orderId: string;
  stripeId: string;
}

interface IPaymentModel extends Model<IPaymentDoc> {
  build(attrs: IPayment): IPaymentDoc
}

const paymentSchema = new Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

paymentSchema.statics.build = (attrs: IPayment) => {
  return new Payment(attrs)
};

const Payment = mongoose.model<IPaymentDoc, IPaymentModel>('Payment', paymentSchema);

export { Payment };
