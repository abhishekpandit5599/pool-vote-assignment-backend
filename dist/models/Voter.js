"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VoterSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    poolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Pool',
        required: true,
    },
    option: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Voter = (0, mongoose_1.model)("Voter", VoterSchema);
exports.default = Voter;
