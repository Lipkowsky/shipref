import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import webhookRoute from "./routes/webhooks.route";
import rivalryRoute from "./routes/rivalry.route";
import { connectDB } from "./config/db";
import { clerkMiddleware } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware";
import { AppError } from "./utils/AppError";
import userRoute from "./routes/user.route";
import cardEventRoute from "./routes/cardEvent.route";

const app = express();
const port = process.env.PORT || 8003;
app.use(clerkMiddleware())
app.use(
  cors({
    origin: ["http://localhost:5173", "https://shipref.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", webhookRoute);
app.use("/api/rivalry", rivalryRoute);
app.use("/api/user", userRoute);
app.use("/api/cards", cardEventRoute);


app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get("/protected", shouldBeUser, (req: Request, res: Response) => {
  return res.status(200).json({
    message: "You are authenticated",
    userId: req.userId,
  });
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err instanceof AppError ? err.statusCode : 500;

  return res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

const start = async () => {
  try {
   await connectDB();
    app.listen(port, () => {
      console.log(`Backend is running on port ${port}`);
    })
  } catch (error) {
    console.error("Error starting Backend Service:", error);
    process.exit(1);
  }
}
start();
