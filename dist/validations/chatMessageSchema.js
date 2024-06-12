"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageSchema = exports.sendMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Define Joi schema for a message
const messageSchema = joi_1.default.object({
    content: joi_1.default.string().required().min(1).max(1000),
});
// Define Joi schema for sending a message in a chat
exports.sendMessageSchema = joi_1.default.object({
    poolId: joi_1.default.string().required(), // assuming poolId is an ObjectId in string format
    message: messageSchema.required()
});
// Define Joi schema for chat message
exports.getMessageSchema = joi_1.default.object({
    poolId: joi_1.default.string().required(),
});
