"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = exports.getPools = exports.votePool = exports.createPool = void 0;
const Pool_1 = __importDefault(require("../../models/Pool"));
const Voter_1 = __importDefault(require("../../models/Voter"));
const responseUtils_1 = require("../../utils/responseUtils");
const errorMessages_json_1 = __importDefault(require("../../config/errorMessages.json"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../socket/pooling/index");
const createPool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, options } = req.body;
    const userId = req.user.id;
    try {
        const newPool = new Pool_1.default({
            topic,
            options,
            createdBy: new mongoose_1.default.Types.ObjectId(userId),
            votes: options.reduce((acc, option) => {
                acc[option] = 0;
                return acc;
            }, {}),
        });
        yield newPool.save();
        return res.status(201).json((0, responseUtils_1.successResponse)(newPool));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.createPool = createPool;
const votePool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { poolId, option } = req.body;
    const userId = req.user.id;
    try {
        const pool = yield Pool_1.default.findById(poolId);
        if (!pool) {
            return res.status(404).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.poolNotFound));
        }
        if (!pool.options.includes(option)) {
            return res.status(400).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.invalidOption));
        }
        const existingVoter = yield Voter_1.default.findOne({ userId, poolId });
        if (existingVoter) {
            return res.status(400).json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.alreadyVoted));
        }
        const newVoter = new Voter_1.default({ userId: new mongoose_1.default.Types.ObjectId(userId), poolId, option });
        yield newVoter.save();
        pool.votes[option] = (pool.votes[option] || 0) + 1;
        pool.markModified('votes');
        yield pool.save();
        // Update polling results for all connected clients
        (0, index_1.updatePollingResults)(req.app.get("socketServer"), poolId);
        return res.json((0, responseUtils_1.successResponse)(pool));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.votePool = votePool;
const getPools = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pools = yield Pool_1.default.find();
        return res.json((0, responseUtils_1.successResponse)(pools));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.getPools = getPools;
const getPool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pools = yield Pool_1.default.findById(req.params.poolId);
        return res.json((0, responseUtils_1.successResponse)(pools));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.getPool = getPool;
