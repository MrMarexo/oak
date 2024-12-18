"use server";

import { pusherServer } from "@/lib/pusher";
import prisma from "@/lib/db";
import {
  DrawCardGamePublicResponse,
  DrawCardPlayerPrivateResponse,
} from "@/types/game.types";
import { get } from "http";
import { getGameGeneralChannel, getGamePlayerChannel } from "@/helpers";
import { GAME_GENERAL_EVENTS, GAME_PLAYER_EVENTS } from "@/consts";

export const drawCard = async (gameId: string, playerPrivateId: string) => {
  const res = await prisma.gameStatePrivate.findUnique({
    where: {
      gameId,
    },
    select: {
      currencyCardsDeck: {
        take: 1,
        select: {
          id: true,
        },
      },
    },
  });

  if (!res) {
    throw new Error("Game not found");
  }

  if (res.currencyCardsDeck.length <= 0) {
    throw new Error("No more cards left");
  }

  await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      gameStatePrivate: {
        update: {
          currencyCardsDeck: {
            disconnect: {
              id: res.currencyCardsDeck[0].id,
            },
          },
        },
      },
      numberOfCurrencyCardsLeft: {
        decrement: 1,
      },
      currentPhase: "Buying",
    },
  });

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    select: {
      currentPhase: true,
      numberOfCurrencyCardsLeft: true,
    },
  });

  const { playerStatePrivate, id: playerId } = await prisma.player.update({
    where: {
      privateId: playerPrivateId,
    },
    data: {
      numberOfCurrencyCardsInHand: {
        increment: 1,
      },
      playerStatePrivate: {
        update: {
          currencyCardsInHand: {
            connect: {
              id: res.currencyCardsDeck[0].id,
            },
          },
        },
      },
    },
    select: {
      id: true,
      playerStatePrivate: {
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
      },
    },
  });

  if (!playerStatePrivate) {
    throw new Error("Player not updated");
  }

  if (!game) {
    throw new Error("Game not updated");
  }

  const playerObj: DrawCardPlayerPrivateResponse = {
    currencyCardsInHand: playerStatePrivate.currencyCardsInHand,
  };

  const gameObj: DrawCardGamePublicResponse = {
    currentPhase: game.currentPhase,
    numberOfCurrencyCardsLeft: game.numberOfCurrencyCardsLeft,
    playerIdWithExtraCard: playerId,
  };

  await pusherServer.trigger(
    getGamePlayerChannel(gameId, playerPrivateId),
    GAME_PLAYER_EVENTS.drawCard,
    playerObj
  );

  await pusherServer.trigger(
    getGameGeneralChannel(gameId),
    GAME_GENERAL_EVENTS.playerDrawsCard,
    gameObj
  );
};