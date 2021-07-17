import mongoose, { Document, Model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicket {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ITicket) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);

export { Ticket };