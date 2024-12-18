import { AnyCard } from "./types/game.types";

export const getGameGeneralChannel = (gameId: string) => `game-${gameId}`;

export const getGamePlayerChannel = (gameId: string, playerPrivateId: string) =>
  `game-${gameId}-player-${playerPrivateId}`;

export const shuffleCardsGeneric = <T extends {}>(cards: T[]): T[] => {
  return cards.sort(() => Math.random() - 0.5);
};

export const getSuitSymbol = (suit: AnyCard["suit"]) => {
  switch (suit) {
    case "Heart":
      return "♥️";
    case "Diamond":
      return "♦️";
    case "Club":
      return "♣️";
    case "Spade":
      return "♠️";
  }
};

export const getCardType = (type: AnyCard["type"]) => {
  switch (type) {
    case "Two":
      return "2";
    case "Three":
      return "3";
    case "Four":
      return "4";
    case "Five":
      return "5";
    case "Six":
      return "6";
    case "Seven":
      return "7";
    case "Eight":
      return "8";
    case "Nine":
      return "9";
    case "Ten":
      return "10";
    case "Joker":
      return "Joker";
    case "Jack":
      return "J";
    case "Queen":
      return "Q";
    case "King":
      return "K";
    case "Ace":
      return "Ace";
  }
};
