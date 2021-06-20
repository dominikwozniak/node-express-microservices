import mongoose, { Document, Model, Schema } from 'mongoose';

interface ITicket {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
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
    required: true
  },
  userId: {
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

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);

export { Ticket };