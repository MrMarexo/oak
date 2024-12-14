"use server";

import { pusherServer } from "@/lib/pusher";

export const changeGameState = async (gameId: string, gameState: string) => {
  pusherServer.trigger(gameId, "game-state-change", {
    state: gameState,
    currentPlayer: 1,
  });
  // update db
};
