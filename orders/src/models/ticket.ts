import mongoose, { Document, Model, Schema } from 'mongoose';
import { Order, OrderDoc, OrderStatus } from "./order";

interface ITicket {
  id: string;
  title: string;
  price: number;
}

interface ITicketDoc extends Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ITicketModel extends Model<ITicketDoc> {
  build(attrs: ITicket): ITicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<ITicketDoc | null>;
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

ticketSchema.set('versionKey', 'version');

ticketSchema.pre('save', function(done) {
  // @ts-ignore
  this.$where = {
    version: this.get('version') - 1
  };

  done();
});

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
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