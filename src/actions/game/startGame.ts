"use server";

import { GAME_GENERAL_EVENTS, GAME_PLAYER_EVENTS } from "@/consts";
import {
  getGameGeneralChannel,
  getGamePlayerChannel,
  shuffleCardsGeneric,
} from "@/helpers";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { Game, PlayerStatePrivate } from "@/types/game.types";
import { cookies } from "next/headers";

const INITIAL_CURRENCY_CARDS_IN_HAND = 5;

export const startGame = async (gameId: string) => {
  const cookieStore = await cookies();
  const playerId = cookieStore.get("playerId");

  if (!playerId) {
    return;
  }

  const res = await prisma.player.findUnique({
    where: {
      privateId: playerId.value,
      gameIdForPlayers: gameId,
    },
    select: {
      isHost: true,
    },
  });

  if (!res?.isHost) {
    return;
  }

  const allCurrencyCards = await prisma.currencyCard.findMany({});
  const allCharacterCards = await prisma.characterCard.findMany({});
  const allAceCards = await prisma.aceCard.findMany({});

  // shuddle cards
  const shuffledCurrencyCards = shuffleCardsGeneric(allCurrencyCards);
  const shuffledCharacterCards = shuffleCardsGeneric(allCharacterCards);
  const shuffledAceCards = shuffleCardsGeneric(allAceCards);

  const playersIds = await prisma.player.findMany({
    where: {
      gameIdForPlayers: gameId,
    },
    select: {
      privateId: true,
      id: true,
    },
  });

  // distribute cards
  for (const { privateId } of playersIds) {
    const currencyCardsInPayersHand = shuffledCurrencyCards.splice(
      0,
      INITIAL_CURRENCY_CARDS_IN_HAND
    );
    await prisma.player.update({
      where: {
        privateId,
      },
      data: {
        numberOfCurrencyCardsInHand: INITIAL_CURRENCY_CARDS_IN_HAND,
        playerStatePrivate: {
          update: {
            currencyCardsInHand: {
              set: currencyCardsInPayersHand.map(({ id }) => ({ id })),
            },
            currencyCardsOrder: currencyCardsInPayersHand.map(({ id }) => id),
          },
        },
      },
    });
    const playerPrivateObj: PlayerStatePrivate = {
      currencyCardsInHand: currencyCardsInPayersHand,
      currencyCardsOrder: [],
    };
    pusherServer.trigger(
      getGamePlayerChannel(gameId, privateId),
      GAME_PLAYER_EVENTS.getCards,
      playerPrivateObj
    );
  }

  const availableCharacterCards = shuffledCharacterCards.splice(0, 4);

  const {
    title,
    gameStatus,
    aceCardsAvailable,
    characterCardsAvailable,
    currentPhase,
    currentPlayer,
    currentTurn,
    numberOfCharacterCardsLeft,
    numberOfCurrencyCardsLeft,
    players,
  } = await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      characterCardsAvailable: {
        set: availableCharacterCards.map(({ id }) => ({ id })),
      },
      aceCardsAvailable: {
        set: shuffledAceCards.map(({ id }) => ({ id })),
      },
      numberOfCharacterCardsLeft: shuffledCharacterCards.length,
      numberOfCurrencyCardsLeft: shuffledCurrencyCards.length,
      gameStatus: "Playing",
      currentPhase: "Draw",
      currentTurn: 1,
      currentPlayer: {
        connect: {
          id: playersIds[0].id,
        },
      },
      gameStatePrivate: {
        update: {
          currencyCardsDeck: {
            set: shuffledCurrencyCards.map(({ id }) => ({ id })),
          },
          characterCardsDeck: {
            set: shuffledCharacterCards.map(({ id }) => ({ id })),
          },
        },
      },
    },
    select: {
      title: true,
      gameStatus: true,
      aceCardsAvailable: {
        select: {
          id: true,
          suit: true,
          color: true,
          type: true,
        },
      },
      characterCardsAvailable: {
        select: {
          id: true,
          price: true,
          suit: true,
          effect: true,
          color: true,
          type: true,
        },
      },
      currentPhase: true,
      currentPlayer: {
        select: {
          id: true,
          name: true,
        },
      },
      currentTurn: true,
      numberOfCharacterCardsLeft: true,
      numberOfCurrencyCardsLeft: true,
      players: {
        select: {
          name: true,
          id: true,
          numberOfCurrencyCardsInHand: true,
          builtAces: {
            select: {
              suit: true,
              id: true,
              color: true,
              type: true,
            },
          },
          builtCharacterCards: {
            select: {
              price: true,
              suit: true,
              id: true,
              color: true,
              type: true,
            },
          },
        },
      },
    },
  });

  const gameObj: Game = {
    title,
    gameStatus,
    aceCardsAvailable,
    characterCardsAvailable,
    currentPhase,
    currentPlayer,
    currentTurn,
    numberOfCharacterCardsLeft,
    numberOfCurrencyCardsLeft,
    players,
  };

  pusherServer.trigger(
    getGameGeneralChannel(gameId),
    GAME_GENERAL_EVENTS.gameStart,
    gameObj
  );
};
