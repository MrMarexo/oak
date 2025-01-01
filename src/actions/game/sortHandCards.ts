"use server";

import prisma from "@/lib/db";

export const sortHandCards = async ({
  newCardOrder,
  playerPrivateId,
}: {
  newCardOrder: string[];
  playerPrivateId: string;
}) => {
  const currentCards = await prisma.playerStatePrivate.findUnique({
    where: {
      playerId: playerPrivateId,
    },
    select: {
      currencyCardsInHand: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!currentCards) {
    throw new Error("Player not found");
  }

  newCardOrder.forEach((id, index) => {
    const found = currentCards.currencyCardsInHand.find((c) => c.id === id);

    if (!found) {
      throw new Error("Card not found");
    }
  });

  await prisma.playerStatePrivate.update({
    where: {
      playerId: playerPrivateId,
    },
    data: {
      currencyCardsOrder: newCardOrder,
    },
    select: {
      currencyCardsInHand: {
        select: {
          id: true,
          suit: true,
          color: true,
          type: true,
          value: true,
        },
      },
    },
  });
};
