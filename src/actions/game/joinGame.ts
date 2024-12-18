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
        NOT: {
          gameForPlayers: {
            gameStatus: "Ended",
          },
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

  const { privateId } = await prisma.player.create({
    data: {
      name: playerName,
      gameForPlayers: { connect: { id: gameId } },
      playerStatePrivate: {
        create: {},
      },
    },
  });

  cookieStore.set("playerId", privateId, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 3600 * 4, // 4 hours
  });
};
