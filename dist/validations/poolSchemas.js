"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.votePoolSchema = exports.createPoolSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createPoolSchema = joi_1.default.object({
    topic: joi_1.default.string().required(),
    options: joi_1.default.array().items(joi_1.default.string().required()).min(2).required()
});
exports.votePoolSchema = joi_1.default.object({
    poolId: joi_1.default.string().required(),
    option: joi_1.default.string().required()
});
