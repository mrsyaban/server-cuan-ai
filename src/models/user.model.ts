import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  riskProfile: String | undefined;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  riskProfile: { type: String, default: undefined},
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);