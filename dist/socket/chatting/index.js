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
exports.poolChatHandler = void 0;
const Chat_1 = __importDefault(require("../../models/Chat"));
const rooms = {};
const poolChatHandler = (socket) => {
    const createRoom = (poolId) => {
        if (!rooms[poolId]) {
            rooms[poolId] = [];
        }
        socket.emit("room-created", { poolId });
        console.log("Created new room for pool:", poolId);
    };
    const joinRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            if (!rooms[roomId].includes(peerId)) {
                rooms[roomId].push(peerId);
                socket.join(roomId);
                socket.to(roomId).emit("user-joined", { peerId });
                socket.emit("get-users", {
                    roomId,
                    participants: rooms[roomId],
                });
                console.log("User joined the room:", roomId, peerId);
            }
        }
        else {
            rooms[roomId] = [peerId];
            socket.join(roomId);
            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId],
            });
            console.log("Room created and user joined:", roomId, peerId);
        }
        socket.on("disconnect", () => {
            leaveRoom({ roomId, peerId });
            console.log("User left the room:", roomId, peerId);
        });
    };
    const leaveRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
            socket.to(roomId).emit("user-disconnected", peerId);
            console.log("User disconnected from room:", roomId, peerId);
        }
    };
    const sendMessage = (roomId, message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chatMessage = {
                sender: message.sender,
                content: message.content,
                createdAt: new Date(),
            };
            // Save the message to the database
            yield Chat_1.default.create({
                poolId: roomId,
                message: chatMessage,
            });
            // Emit the new message to all clients in the room
            socket.to(roomId).emit("new-message", chatMessage);
            console.log("Message sent to room:", roomId);
        }
        catch (error) {
            console.error("Error sending message:", error);
            // Handle errors as needed
        }
    });
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("send-message", sendMessage);
};
exports.poolChatHandler = poolChatHandler;
