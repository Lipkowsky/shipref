import { Router } from "express";
import { getUser } from "../services/user.service";
import { shouldBeUser } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", shouldBeUser, async (req, res, next) => {
  try {
    const user = await getUser(req.clerkId);
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;