"use server";

import prisma from "@/lib/db";
import { cookies } from "next/headers";

export const joinGame = async ({
  playerName,
  gameId,
}: {
  playerName: string;
  gameId: string;
}) => {
  if (!gameId || typeof gameId !== "string") {
    throw new Error("Invalid game ID");
  }

  const cookieStore = await cookies();

  const existingPlayerId = cookieStore.get("playerId");
  if (existingPlayerId) {
    const found = await prisma.player.findUnique({
      where: {
        id: existingPlayerId.value,
        game: {
          ended: false,
        },
      },
    });

    if (found) {
      return {
        message: "Cannot join another game while still in an active game",
      };
    }
  }

  if (!playerName || typeof playerName !== "string") {
    playerName = "Player";
  }

  const { id: playerId } = await prisma.player.create({
    data: {
      name: playerName,
      gameId: gameId,
    },
  });

  cookieStore.set("playerId", playerId, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 3600 * 4, // 4 hours
  });
};
