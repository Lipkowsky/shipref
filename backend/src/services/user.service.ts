
import { CreateUserInput } from "../../types/types";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

export const createOrUpdateUser = async (data: CreateUserInput) => {
  return await User.findOneAndUpdate(
    { clerkId: data.clerkId },
    data,
    { upsert: true, new: true }
  );
};

export const getUser = async (clerkId: string) => {
  const user = await User.findOne({ clerkId }).lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };
};