import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
declare global {
  namespace Express {
    interface Request {
      clerkId: string;
      userId: string;
    }
  }
}

export const shouldBeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = getAuth(req);
    const clerkId = auth.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const user = await User.findOne({ clerkId: clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    req.clerkId = clerkId;

    req.userId = user._id.toString();

    return next();
  } catch (error) {
    console.error("Error in shouldBeUser middleware:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during authentication" });
  }
};
