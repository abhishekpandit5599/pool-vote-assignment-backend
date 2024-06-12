import { Socket } from "socket.io";
import Pool from "../../models/Pool";

// Function to update and emit polling results
export const updatePollingResults = async (
  socket: Socket,
  poolId: string
) => {
  try {
    const pool = await Pool.findById(poolId);
    if (!pool) {
      console.error("Pool not found");
      return;
    }

    // Emit updated polling results to all clients in the room
    socket.to(poolId).emit("polling-results-updated", pool.votes);
    console.log("Polling results updated for pool:", poolId);
  } catch (error) {
    console.error("Error updating polling results:", error);
  }
};
