"use server";

import { CurrencyCard } from "@/types/game.types";
import prisma from "@/lib/db";

export const getAllCardsOfAColor = async (color: CurrencyCard["color"]) => {
  const allCardsTwice = await prisma.currencyCard.findMany({
    where: {
      color,
    },
    select: {
      id: true,
      suit: true,
      color: true,
      type: true,
      value: true,
    },
  });

  const cardsOnce: CurrencyCard[] = [];

  allCardsTwice
    .filter((card) => card.type !== "Joker")
    .forEach((card) => {
      if (
        !cardsOnce.find((c) => c.suit === card.suit && c.type === card.type)
      ) {
        cardsOnce.push(card);
      }
    });

  return cardsOnce;
};
