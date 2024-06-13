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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSocket = exports.poolChatHandler = void 0;
const socketEvents_1 = require("../../config/socketEvents");
const rooms = {};
const poolChatHandler = (socket) => {
    const createRoom = (poolId) => {
        if (!rooms[poolId]) {
            rooms[poolId] = [];
        }
        socket.emit(socketEvents_1.SOCKET_EVENTS.ROOM_CREATED, { poolId });
        console.log("Created new room for pool:", poolId);
    };
    const joinRoom = ({ roomId, peerId }) => {
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
    socket.on(socketEvents_1.SOCKET_EVENTS.CREATE_ROOM, createRoom);
    socket.on(socketEvents_1.SOCKET_EVENTS.JOIN_ROOM, joinRoom);
    // socket.on(SOCKET_EVENTS.SEND_MESSAGE, sendMessageSocket);
};
exports.poolChatHandler = poolChatHandler;
const sendMessageSocket = (socket, roomId, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatMessage = {
            sender: message.sender,
            content: message.content,
            createdAt: new Date(),
        };
        // Emit the new message to all clients in the room
        socket.to(roomId).emit(socketEvents_1.SOCKET_EVENTS.NEW_MESSAGE, chatMessage);
        console.log("Message sent to room:", roomId);
    }
    catch (error) {
        console.error("Error sending message:", error);
        // Handle errors as needed
    }
});
exports.sendMessageSocket = sendMessageSocket;
