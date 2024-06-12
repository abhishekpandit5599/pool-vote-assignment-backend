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
exports.updatePollingResults = void 0;
const Pool_1 = __importDefault(require("../../models/Pool"));
// Function to update and emit polling results
const updatePollingResults = (socket, poolId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield Pool_1.default.findById(poolId);
        if (!pool) {
            console.error("Pool not found");
            return;
        }
        // Emit updated polling results to all clients in the room
        socket.to(poolId).emit("polling-results-updated", pool.votes);
        console.log("Polling results updated for pool:", poolId);
    }
    catch (error) {
        console.error("Error updating polling results:", error);
        // Handle errors as needed
    }
});
exports.updatePollingResults = updatePollingResults;
