"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const createGame = async ({ playerName }: { playerName: string }) => {
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
      return { message: "Cannot create a new game while in an active game" };
    }
  }

  if (!playerName || typeof playerName !== "string") {
    playerName = "Player";
  }

  const { id: gameId } = await prisma.game.create({
    data: {
      title: `${playerName}'s game`,
      gameStatePrivate: {
        create: {},
      },
    },
    select: {
      id: true,
    },
  });

  const { privateId } = await prisma.player.create({
    data: {
      name: playerName,
      gameForPlayers: { connect: { id: gameId } },
      isHost: true,
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

  redirect(`/game/${gameId}`);
};
