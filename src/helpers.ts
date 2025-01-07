import { JOKER_TYPE } from "./consts";
import {
  AnyCard,
  CardSuit,
  CurrencyCard,
  JokerAlternative,
  SuitCurrencyGroups,
} from "./types/game.types";

export const getGameGeneralChannel = (gameId: string) => `game-${gameId}`;

export const getGamePlayerChannel = (gameId: string, playerPrivateId: string) =>
  `game-${gameId}-player-${playerPrivateId}`;

export const shuffleCardsGeneric = <T extends {}>(cards: T[]): T[] => {
  const unshuffled = [...cards];
  return unshuffled.sort(() => Math.random() - 0.5);
};

export const getColorFromSuit = (suit: CardSuit) => {
  if (suit === "Heart" || suit === "Diamond") {
    return "Red";
  }
  return "Black";
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
    default:
      return "";
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

export const orderCurrencyCards = (cards: CurrencyCard[], order: string[]) => {
  if (order.length === 0) {
    return cards;
  }
  let error = false;
  const ordered = order.map((id) => {
    const found = cards.find((card) => card.id === id);

    if (!found) {
      error = true;
      return {} as CurrencyCard;
    }
    return found;
  });
  if (error) {
    console.error("Card order mismatch");
    return cards;
  }

  return ordered;
};

export const getSuitCurrencyGroups = (
  cards: CurrencyCard[],
  jokerAlternatives?: JokerAlternative[]
) => {
  const groups: SuitCurrencyGroups = {
    Heart: [],
    Diamond: [],
    Club: [],
    Spade: [],
  };

  cards.forEach((card) => {
    if (card.type === JOKER_TYPE) {
      if (!jokerAlternatives || !jokerAlternatives.length) {
        return;
      }
      const alternative = jokerAlternatives.find(
        (alt) => alt.jokerCard.id === card.id
      );
      if (alternative && alternative.alternativeCard.suit) {
        groups[alternative.alternativeCard.suit].push(
          alternative.alternativeCard
        );
        return;
      }
    }
    if (card.suit) {
      groups[card.suit].push(card);
    }
  });

  return groups;
};

export const calculateDoubles = (cards: CurrencyCard[]) => {
  if (cards.length < 2) {
    return {
      doubles: [],
      leftovers: cards,
    };
  }

  const doubles: CurrencyCard[][] = [];

  const leftovers: CurrencyCard[] = [];

  const sorted = sortCardsByValueAndSuit(cards);

  for (let i = 0; i < sorted.length; i++) {
    const curCard = sorted[i];
    if (!curCard.value || !curCard.suit) {
      leftovers.push(curCard);
      continue;
    }

    const nextCard = sorted[i + 1];
    if (!nextCard?.value || !nextCard.suit) {
      leftovers.push(curCard);
      continue;
    }

    if (curCard.value === nextCard.value && curCard.suit === nextCard.suit) {
      doubles.push([curCard, nextCard]);
      i++;
    } else {
      leftovers.push(curCard);
    }
  }

  return { doubles, leftovers };
};

export const calculateKinds = (cards: CurrencyCard[]) => {
  if (cards.length < 3) {
    return {
      kinds: [],
      leftovers: cards,
    };
  }

  const kinds: CurrencyCard[][] = [];

  const paired: CurrencyCard[] = [];

  const leftovers: CurrencyCard[] = [];

  const suits: CardSuit[] = ["Heart", "Diamond", "Club", "Spade"];

  cards.forEach((card) => {
    if (paired.includes(card) || leftovers.includes(card)) {
      return;
    }

    const kindRow: CurrencyCard[] = [card];

    suits.forEach((suit) => {
      const found = cards.find(
        (c) =>
          c.suit === suit &&
          c.suit !== card.suit &&
          c.value === card.value &&
          !paired.includes(c) &&
          !leftovers.includes(c)
      );

      if (found) {
        kindRow.push(found);
      }
    });

    if (kindRow.length > 2) {
      kinds.push(kindRow);
      paired.push(...kindRow);
    } else {
      leftovers.push(...kindRow);
    }
  });

  return { kinds, leftovers };
};

export const calculateStraights = (groups: SuitCurrencyGroups) => {
  const straights: CurrencyCard[][] = [];

  const leftoverCards: CurrencyCard[] = [];

  Object.entries(groups).forEach(([_, cards]) => {
    const loop = (cards: CurrencyCard[]) => {
      const sortedCards = sortCardsByValue(cards);

      const lefties: CurrencyCard[] = [];
      const doubles: CurrencyCard[] = [];

      if (sortedCards.length < 3) {
        return {
          lefties: sortedCards,
          doubles: [],
        };
      }

      for (let i = 0; i < sortedCards.length; i++) {
        const curCard = sortedCards[i];
        if (!curCard.value) {
          continue;
        }

        const straightRow = [curCard];
        let lastCardInStraightIndex = i;

        const addition = 1;
        let loopIndex = 1 + i;

        while (loopIndex < sortedCards.length) {
          const nextCard = sortedCards[loopIndex];
          if (!nextCard?.value) {
            break;
          }

          const prevCardInStraight = straightRow[straightRow.length - 1];
          if (!prevCardInStraight.value) {
            break;
          }

          if (prevCardInStraight.value === nextCard.value) {
            doubles.push(nextCard);
            loopIndex++;
            continue;
          }

          if (prevCardInStraight.value + addition === nextCard.value) {
            straightRow.push(nextCard);
            lastCardInStraightIndex = loopIndex;
            loopIndex++;
          } else {
            break;
          }
        }

        if (straightRow.length > 2) {
          straights.push(straightRow);
          i = lastCardInStraightIndex;
        } else {
          lefties.push(curCard);
        }
      }

      return {
        lefties,
        doubles,
      };
    };

    let { lefties, doubles } = loop(cards);

    if (doubles.length) {
      const newSet = new Set([...lefties, ...doubles]);
      const cleanLefties = Array.from(newSet);
      const { lefties: lefties2 } = loop(cleanLefties);
      lefties = lefties2;
    }

    leftoverCards.push(...lefties);
  });

  return { straights, leftoverCards };
};

export const sortCardsByValue = (cards: CurrencyCard[]) => {
  if (cards.length === 0) return cards;
  const unsorted = [...cards];
  return unsorted.sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
};

export const sortCardsByValueAndSuit = (cards: CurrencyCard[]) => {
  if (cards.length === 0) return cards;
  return cards.sort((a, b) => {
    if (!a.suit) {
      a.suit = a.color === "Red" ? "Heart" : "Club";
    }
    if (!b.suit) {
      b.suit = b.color === "Red" ? "Heart" : "Club";
    }
    if (a.value === b.value) {
      return a.suit.localeCompare(b.suit);
    }
    return (a.value ?? 0) - (b.value ?? 0);
  });
};
