import mongoose, { Document, Model, Schema } from 'mongoose';

interface IOrder {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc
}

interface IOrderDoc extends Document {
  userId: string;
  status: string;
  expiresAt: Date;
  ticket: TicketDoc
}

interface IOrderModel extends Model<IOrderDoc> {
  build(attrs: IOrder): IOrderDoc
}

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Schema.Types.Date
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.statics.build = (attrs: IOrder) => {
  return new Order(attrs);
};

const Order = mongoose.model<IOrderDoc, IOrderModel>('Ticket', orderSchema);

export { Order };