import { Socket } from "socket.io";
import Chat from "../../models/Chat";

const rooms: Record<string, string[]> = {};

interface IRoomParams {
  roomId: string;
  peerId: string;
}

export const poolChatHandler = (socket: Socket) => {
  const createRoom = (poolId: string) => {
    if (!rooms[poolId]) {
      rooms[poolId] = [];
    }
    socket.emit("room-created", { poolId });
    console.log("Created new room for pool:", poolId);
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
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
    } else {
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

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
      socket.to(roomId).emit("user-disconnected", peerId);
      console.log("User disconnected from room:", roomId, peerId);
    }
  };

  const sendMessage = async (
    roomId: string,
    message: { sender: string; content: string }
  ) => {
    try {
      const chatMessage = {
        sender: message.sender,
        content: message.content,
        createdAt: new Date(),
      };

      // Save the message to the database
      await Chat.create({
        poolId: roomId,
        message: chatMessage,
      });

      // Emit the new message to all clients in the room
      socket.to(roomId).emit("new-message", chatMessage);
      console.log("Message sent to room:", roomId);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle errors as needed
    }
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("send-message", sendMessage);
};
