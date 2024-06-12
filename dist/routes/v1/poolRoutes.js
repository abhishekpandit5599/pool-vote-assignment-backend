"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const poolController_1 = require("../../controllers/v1/poolController");
const chatController_1 = require("../../controllers/v1/chatController");
const validateRequest_1 = require("../../middleware/validateRequest");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const poolSchemas_1 = require("../../validations/poolSchemas");
const chatMessageSchema_1 = require("../../validations/chatMessageSchema");
const router = (0, express_1.Router)();
// Pool routes
router.post("/create", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(poolSchemas_1.createPoolSchema), poolController_1.createPool);
router.post("/vote", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(poolSchemas_1.votePoolSchema), poolController_1.votePool);
router.get("/getPools", poolController_1.getPools);
// Chat routes
router.post("/chat/send", authMiddleware_1.authMiddleware, (0, validateRequest_1.validateRequest)(chatMessageSchema_1.sendMessageSchema), chatController_1.sendMessage);
router.get("/chat/:poolId", authMiddleware_1.authMiddleware, chatController_1.getMessages);
exports.default = router;
