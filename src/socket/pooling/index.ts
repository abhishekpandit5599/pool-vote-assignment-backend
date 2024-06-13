import { Socket } from "socket.io";
import Pool from "../../models/Pool";
import { SOCKET_EVENTS } from "../../config/socketEvents";

const rooms: Record<string, string[]> = {};
interface IRoomParams {
  roomId: string;
  peerId: string;
}

export const poolHandler = (socket: Socket) => {

  const joinPool = ({ roomId, peerId }: IRoomParams) => {
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

  socket.on(SOCKET_EVENTS.JOIN_POOL, joinPool);
};

// Function to update and emit polling results
export const updatePollingResults = async (socket: Socket, poolId: string) => {
  try {
    const pool = await Pool.findById(poolId);
    if (!pool) {
      console.error("Pool not found");
      return;
    }

    // Emit updated polling results to all clients in the room
    socket.to(poolId).emit(SOCKET_EVENTS.POLLING_RESULTS_UPDATED, pool.votes);
    console.log("Polling results updated for pool:", poolId);
  } catch (error) {
    console.error("Error updating polling results:", error);
  }
};

