import mongoose, { Document, Model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@dwticketing/common";
import { TicketDoc } from "./ticket";

export { OrderStatus }

interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc
}

interface IOrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
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
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrder) => {
  return new Order(attrs);
};

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export { Order, IOrderDoc as OrderDoc };