import { Router, Request, Response } from "express";
import { ClerkWebhookEvent } from "../../types/types";
import { Webhook } from "svix";
import { createOrUpdateUser } from "../services/user.service";

const router: Router = Router();

router.post("/clerk/webhooks", async (req: Request, res: Response) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET as string;

    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    const payload = JSON.stringify(req.body);

    const wh = new Webhook(WEBHOOK_SECRET);

    const evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = evt.data;

      await createOrUpdateUser({
        clerkId: user.id,
        email: user.email_addresses?.[0]?.email_address,
        firstName: user.first_name,
        lastName: user.last_name,
        imageUrl: user.image_url,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return res.status(400).send("Webhook error");
  }
});

export default router;
