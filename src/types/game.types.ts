import { $Enums, Prisma } from "@prisma/client";

export type SuitCurrencyGroups = Record<$Enums.CardSuit, CurrencyCard[]>;

export type JokerAlternative = {
  jokerCard: CurrencyCard;
  alternativeCard: CurrencyCard;
};

export type CardSuit = keyof SuitCurrencyGroups;

export type PlayerName = Prisma.PlayerGetPayload<{
  select: {
    name: true;
    id: true;
    isHost: true;
    privateId: true;
  };
}>;

export type PlayerStatePrivate = Prisma.PlayerStatePrivateGetPayload<{
  select: {
    currencyCardsInHand: {
      select: {
        id: true;
        suit: true;
        color: true;
        type: true;
        value: true;
      };
    };
    currencyCardsOrder: true;
  };
}>;

// PUSHER EVENT RESPONSE TYPES

export type DrawCardGamePublicResponse = Prisma.GameGetPayload<{
  select: {
    currentPhase: true;
    numberOfCurrencyCardsLeft: true;
  };
}> & {
  playerIdWithExtraCard: string;
};

export type DrawCardPlayerPrivateResponse = PlayerStatePrivate;

//////////////////////////////

export type Game = Prisma.GameGetPayload<{
  select: {
    title: true;
    gameStatus: true;
    aceCardsAvailable: {
      select: {
        suit: true;
        id: true;
        color: true;
        type: true;
      };
    };
    characterCardsAvailable: {
      select: {
        price: true;
        suit: true;
        id: true;
        effect: true;
        color: true;
        type: true;
      };
    };
    currentPhase: true;
    currentTurn: true;
    currentPlayer: {
      select: {
        name: true;
        id: true;
      };
    };
    numberOfCharacterCardsLeft: true;
    numberOfCurrencyCardsLeft: true;

    players: {
      select: {
        name: true;
        id: true;
        numberOfCurrencyCardsInHand: true;
        builtAces: {
          select: {
            suit: true;
            id: true;
            color: true;
            type: true;
          };
        };
        builtCharacterCards: {
          select: {
            price: true;
            suit: true;
            id: true;
            color: true;
            type: true;
          };
        };
      };
    };
  };
}>;

export type Players = Game["players"];

export type CharacterCard = Game["characterCardsAvailable"][number];
export type AceCard = Game["aceCardsAvailable"][number];
export type CurrencyCard = PlayerStatePrivate["currencyCardsInHand"][number];
export type AnyCard = CharacterCard | AceCard | CurrencyCard;
