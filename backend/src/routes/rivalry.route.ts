import { Router, Request, Response  } from "express";
import { connectRivalry, getRivalries } from "../services/rivalry.service";
import { shouldBeUser } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";


const router: Router = Router();


router.post("/connect", shouldBeUser, async (req: Request, res: Response) => {
  const { playerId } = req.body;

  if (!playerId) {
    throw new AppError("PlayerId is required", 400);
  }

  await connectRivalry(req.userId, playerId);

  return res.status(200).json({ ok: true });
});

router.get("/rivalries", shouldBeUser, async (req: Request, res: Response) => {
  const rivalries = await getRivalries(req.userId);
  return res.status(200).json({ rivalries });
});

export default router;  