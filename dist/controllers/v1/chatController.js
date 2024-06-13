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
exports.getMessages = exports.sendMessage = void 0;
const Chat_1 = __importDefault(require("../../models/Chat"));
const responseUtils_1 = require("../../utils/responseUtils");
const successMessages_json_1 = __importDefault(require("../../config/successMessages.json"));
const errorMessages_json_1 = __importDefault(require("../../config/errorMessages.json"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../socket/chatting/index");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { poolId, message } = req.body;
    const userId = req.user.id;
    try {
        // Add additional fields to the message
        const enrichedMessage = Object.assign(Object.assign({}, message), { sender: new mongoose_1.default.Types.ObjectId(userId) });
        const newMessage = new Chat_1.default({
            poolId: new mongoose_1.default.Types.ObjectId(poolId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            message: enrichedMessage,
        });
        (0, index_1.sendMessageSocket)(req.app.get("socketServer"), poolId, enrichedMessage);
        yield newMessage.save();
        return res.status(201).json((0, responseUtils_1.successResponse)(successMessages_json_1.default.messageSent));
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { poolId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    try {
        const messages = yield Chat_1.default.find({ poolId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return res.json((0, responseUtils_1.successResponse)(messages));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, responseUtils_1.errorResponse)(errorMessages_json_1.default.INTERNAL_SERVER_ERROR));
    }
});
exports.getMessages = getMessages;
