"use client";

import { changeGameState } from "@/actions/game/changeGameState";
import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher";
import { useEffect } from "react";

import { Prisma } from "@prisma/client";

type Game = Prisma.GameSelect;

export const LiveGame = ({ gameId }: { gameId: string }) => {
  useEffect(() => {
    const channel = pusherClient.subscribe(gameId);
    channel.bind("game-state-change", (data: any) => {
      alert(JSON.stringify(data));
    });
  }, []);

  const changeGameStateHandle = async (state: {
    gameStatus: "not-initiated" | "playing" | "ended";
    currentPlayer?: number;
    turnNumber?: number;
    turnPhase?: "draw" | "buying" | "exchange";
  }) => {
    await changeGameState(gameId, "started");
  };

  return (
    <div>
      <h2 className="mb-4 mt-2">Live game</h2>
      <Button onClick={() => changeGameStateHandle({ gameStatus: "playing" })}>
        Start game
      </Button>
    </div>
  );
};
