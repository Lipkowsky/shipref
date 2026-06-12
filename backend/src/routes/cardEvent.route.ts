import { Router, Request, Response  } from "express";
import { giveRedCard, giveYellowCard } from "../services/cardEvent.service";
import { shouldBeUser } from "../middleware/authMiddleware";

const router: Router = Router();


router.post("/yellow", shouldBeUser, async (req: Request, res: Response, next: Function) => {
  try {
    const { rivalryId, reason } = req.body;

    console.log("Rivalry ID:", rivalryId); // Debug log
    console.log("User ID:", req.userId); // Debug log

    const result = await giveYellowCard(
      rivalryId,
      req.userId,
      reason
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/red", shouldBeUser, async (req: Request, res: Response, next: Function) => {
  try {
    const { rivalryId, reason } = req.body;

    const result = await giveRedCard(
      rivalryId,
      req.userId,
      reason
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;  