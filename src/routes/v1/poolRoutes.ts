import { Router } from "express";
import {
  createPool,
  votePool,
  getPools,
  getPool,
} from "../../controllers/v1/poolController";
import { sendMessage, getMessages } from "../../controllers/v1/chatController";
import { validateRequest } from "../../middleware/validateRequest";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  createPoolSchema,
  votePoolSchema,
} from "../../validations/poolSchemas";
import { sendMessageSchema } from "../../validations/chatMessageSchema";

const router = Router();

// Pool routes
router.post(
  "/create",
  authMiddleware,
  validateRequest(createPoolSchema),
  createPool
);
router.post("/vote", authMiddleware, validateRequest(votePoolSchema), votePool);
router.get("/getPools", getPools);
router.get("/getPool/:poolId", getPool);

// Chat routes
router.post(
  "/chat/send",
  authMiddleware,
  validateRequest(sendMessageSchema),
  sendMessage
);
router.get(
  "/chat/:poolId",
  authMiddleware,
  getMessages
);

export default router;
