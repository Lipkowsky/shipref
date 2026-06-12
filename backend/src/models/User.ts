import { model, Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}



const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: String,
    firstName: String,
    lastName: String,
    imageUrl: String,
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);