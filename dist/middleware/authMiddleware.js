"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseUtils_1 = require("../utils/responseUtils");
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json((0, responseUtils_1.errorResponse)("Unauthorized"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        return res.status(401).json((0, responseUtils_1.errorResponse)("Invalid token"));
    }
};
exports.authMiddleware = authMiddleware;
