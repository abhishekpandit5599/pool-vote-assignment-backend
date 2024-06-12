"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PoolSchema = new mongoose_1.Schema({
    topic: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    votes: {
        type: Object,
        of: Number,
        default: {},
    },
}, { timestamps: true });
const Pool = (0, mongoose_1.model)("Pool", PoolSchema);
exports.default = Pool;
