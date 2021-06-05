import mongoose, { Model, Schema, Document } from 'mongoose';
import { Password } from '../services/password';

// interface describes the properties
// that are required to create a new User
interface IUser {
  email: string;
  password: string;
}

// interface describes the properties
// that a User Model has
interface IUserModel extends Model<IUserDoc> {
  build(attrs: IUser): IUserDoc;
}

// interface describes the properties
// that a User Document has
interface IUserDoc extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},{
  toJSON: {
    /*
    transform function removes unnecessary fields that are returned to users.
    Id is also changed to make the format uniform.
     */
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }

  done();
})

userSchema.statics.build = (user: IUser) => {
  return new User(user);
};

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { User };
