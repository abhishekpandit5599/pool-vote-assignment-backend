import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "../../config/socketEvents";

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
    socket.emit(SOCKET_EVENTS.ROOM_CREATED, { poolId });
    console.log("Created new room for pool:", poolId);
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      if (!rooms[roomId].includes(peerId)) {
        rooms[roomId].push(peerId);
        socket.join(roomId);
        socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, { peerId });
        socket.emit(SOCKET_EVENTS.GET_USERS, {
          roomId,
          participants: rooms[roomId],
        });
        console.log("User joined the room:", roomId, peerId);
      }
    } else {
      rooms[roomId] = [peerId];
      socket.join(roomId);
      socket.emit(SOCKET_EVENTS.GET_USERS, {
        roomId,
        participants: rooms[roomId],
      });
      console.log("Room created and user joined:", roomId, peerId);
    }

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
      socket.to(roomId).emit(SOCKET_EVENTS.USER_DISCONNECTED, peerId);
      console.log("User disconnected from room:", roomId, peerId);
    }
  };

  socket.on(SOCKET_EVENTS.CREATE_ROOM, createRoom);
  socket.on(SOCKET_EVENTS.JOIN_ROOM, joinRoom);
  // socket.on(SOCKET_EVENTS.SEND_MESSAGE, sendMessageSocket);
};

export const sendMessageSocket = async (
  socket: Socket,
  roomId: string,
  message: { sender: string; content: string }
) => {
  try {
    const chatMessage = {
      sender: message.sender,
      content: message.content,
      createdAt: new Date(),
    };

    // Emit the new message to all clients in the room
    socket.to(roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, chatMessage);
    console.log("Message sent to room:", roomId);
  } catch (error) {
    console.error("Error sending message:", error);
    // Handle errors as needed
  }
};
