import mongoose, { Document, Model, Schema } from 'mongoose';
import { Order, OrderDoc, OrderStatus } from "./order";

interface ITicket {
  title: string;
  price: number;
}

interface ITicketDoc extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface ITicketModel extends Model<ITicketDoc> {
  build(attrs: ITicket): ITicketDoc
}

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function() {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder
}

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);

export { Ticket, ITicketDoc as TicketDoc };