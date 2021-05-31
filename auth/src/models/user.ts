import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type:  String,
    required: true
  }
});

const User = mongoose.model<IUser>('User', userSchema);

const buildUser = (user: IUser) => {
  return new User(user)
}

export { User, buildUser };