"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    ipAddress: { type: String },
    otp: { type: String },
    otpExpire: { type: Number },
    visible: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
}, { timestamps: true });
// Indexing
UserSchema.index({ username: 1 });
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
