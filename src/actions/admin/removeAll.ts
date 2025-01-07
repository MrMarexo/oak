"use server";

import prisma from "@/lib/db";

export const removeAll = async () => {
  await prisma.playerStatePrivate.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.gameStatePrivate.deleteMany({});
  await prisma.game.deleteMany({});
};
