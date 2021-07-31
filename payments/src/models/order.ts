import mongoose, { Document, Model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@dwticketing/common";

export { OrderStatus }

interface IOrder {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderDoc extends Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderModel extends Model<IOrderDoc> {
  build(attrs: IOrder): IOrderDoc
}

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrder) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  });
};

const Order = mongoose.model<IOrderDoc, IOrderModel>('Order', orderSchema);

export { Order };
