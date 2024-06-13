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
exports.updatePollingResults = exports.poolHandler = void 0;
const Pool_1 = __importDefault(require("../../models/Pool"));
const socketEvents_1 = require("../../config/socketEvents");
const rooms = {};
const poolHandler = (socket) => {
    const joinPool = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            if (!rooms[roomId].includes(peerId)) {
                rooms[roomId].push(peerId);
                socket.join(roomId);
                socket.to(roomId).emit(socketEvents_1.SOCKET_EVENTS.USER_JOINED, { peerId });
                socket.emit(socketEvents_1.SOCKET_EVENTS.GET_USERS, {
                    roomId,
                    participants: rooms[roomId],
                });
                console.log("User joined the room:", roomId, peerId);
            }
        }
        else {
            rooms[roomId] = [peerId];
            socket.join(roomId);
            socket.emit(socketEvents_1.SOCKET_EVENTS.GET_USERS, {
                roomId,
                participants: rooms[roomId],
            });
            console.log("Room created and user joined:", roomId, peerId);
        }
        socket.on(socketEvents_1.SOCKET_EVENTS.DISCONNECT, () => {
            leaveRoom({ roomId, peerId });
        });
    };
    const leaveRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
            socket.to(roomId).emit(socketEvents_1.SOCKET_EVENTS.USER_DISCONNECTED, peerId);
            console.log("User disconnected from room:", roomId, peerId);
        }
    };
    socket.on(socketEvents_1.SOCKET_EVENTS.JOIN_POOL, joinPool);
};
exports.poolHandler = poolHandler;
// Function to update and emit polling results
const updatePollingResults = (socket, poolId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield Pool_1.default.findById(poolId);
        if (!pool) {
            console.error("Pool not found");
            return;
        }
        // Emit updated polling results to all clients in the room
        socket.to(poolId).emit(socketEvents_1.SOCKET_EVENTS.POLLING_RESULTS_UPDATED, pool.votes);
        console.log("Polling results updated for pool:", poolId);
    }
    catch (error) {
        console.error("Error updating polling results:", error);
    }
});
exports.updatePollingResults = updatePollingResults;
