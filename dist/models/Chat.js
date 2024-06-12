"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    isUpdated: {
        type: Boolean,
        default: false,
    },
}, { _id: false });
const ChatSchema = new mongoose_1.Schema({
    poolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Pool",
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: MessageSchema,
}, { timestamps: true });
const Chat = (0, mongoose_1.model)("Chat", ChatSchema);
exports.default = Chat;
