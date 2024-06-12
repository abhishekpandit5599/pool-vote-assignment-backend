import { Socket } from "socket.io";
import Pool from "../../models/Pool";
import { SOCKET_EVENTS } from "../../config/socketEvents";

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
