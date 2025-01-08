import { Card } from "@/app/_components/cards/Card";
import {
  calculateDoubles,
  calculateKinds,
  calculateStraights,
  getColorFromSuit,
  getSuitCurrencyGroups,
  getSuitSymbol,
} from "@/helpers";
import { CurrencyCard } from "@/types/game.types";
import { useEffect, useState } from "react";
import { CardSuit } from "../../types/game.types";
import { ColoredSymbol } from "@/app/_components/cards/ColoredSymbol";
import { cn, isEmtpyObject } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CombinationVariant = "kinds" | "straights" | "doubles";
type CombinationValue = Partial<Record<CardSuit, number>>;

type Combination = {
  id: string;
  variant: CombinationVariant;
  cards: CurrencyCard[];
  value: CombinationValue;
};

const ValueVisualisation = ({
  value,
  className,
}: {
  value: CombinationValue | null;
  className?: string;
}) => {
  return (
    <div className={cn("flex gap-2 justify-center min-h-7", className)}>
      {value === null ? (
        <h4>
          <i>Waiting for you to choose...</i>
        </h4>
      ) : isEmtpyObject(value) ? (
        <h4>
          <b>None</b>
        </h4>
      ) : (
        <>
          {Object.entries(value).map(([suit, value]) => (
            <div key={suit} className="text-xl">
              <ColoredSymbol
                color={getColorFromSuit(suit as CardSuit)}
                value={getSuitSymbol(suit as CardSuit)}
              />
              <span className="ml-0.5 text-sm font-bold">{value}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const getCardsValue = (cards: CurrencyCard[], shouldDoublePoints: boolean) => {
  if (!cards.length) {
    return {};
  }

  return cards.reduce((acc, card) => {
    if (!card.suit) {
      throw new Error("getCardsValue: card should have suit");
    }
    if (!card.value) {
      throw new Error("getCardsValue: card should have value");
    }
    const addition = shouldDoublePoints ? card.value * 2 : card.value;
    acc[card.suit] = (acc[card.suit] ?? 0) + addition;
    return acc;
  }, {} as CombinationValue);
};

const getDoublesValue = (cards: CurrencyCard[]) => {
  if (cards.length !== 2) {
    throw new Error("getDoublesValue: cards length should be 2");
  }

  if (cards[0].value !== cards[1].value || cards[0].suit !== cards[1].suit) {
    throw new Error(
      "getDoublesValue: cards should have the same value and suit"
    );
  }

  if (!cards[0].suit || !cards[0].value) {
    throw new Error("getDoublesValue: cards should have suit and value");
  }
  const calculated =
    cards.reduce((acc, card) => {
      if (!card.value) {
        throw new Error("getDoublesValue: card should have value");
      }
      acc = acc + card.value;
      return acc;
    }, 0) * 2;

  return {
    [cards[0].suit]: calculated,
  } as CombinationValue;
};

const getKindsValue = (cards: CurrencyCard[]) => {
  const value = {} as CombinationValue;
  if (cards.length < 3) {
    throw new Error("getKindsValue: cards length should be at least 3");
  }

  const calculated =
    cards.reduce((acc, card) => {
      const value = card.value ?? 10;
      acc = acc + value;
      return acc;
    }, 0) * 2;

  cards.forEach((card) => {
    if (!card.suit) {
      throw new Error("getKindsValue: cards should have suit");
    }
    value[card.suit] = calculated;
  });

  return value;
};

const getStraightsValue = (cards: CurrencyCard[]) => {
  if (cards.length < 3) {
    throw new Error("getStraightsValue: cards length should be at least 3");
  }

  const value = {} as CombinationValue;

  const calculated =
    cards.reduce((acc, card) => {
      if (!card.value) {
        throw new Error("getStraightsValue: card should have value");
      }
      acc = acc + card.value;
      return acc;
    }, 0) * 2;

  cards.forEach((card) => {
    if (!card.suit) {
      throw new Error("getStraightsValue: cards should have suit");
    }
    value[card.suit] = calculated;
  });

  return value;
};

export const BuyVisualisation = ({
  selectedCards,
}: {
  selectedCards: CurrencyCard[];
}) => {
  const [availableCombinations, setAvailableCombinations] = useState<
    Combination[]
  >([]);
  const [pickedCombinations, setPickedCombinations] = useState<Combination[]>(
    []
  );

  const [totalValue, setTotalValue] = useState<CombinationValue | null>(null);

  const [cards, setCards] = useState<CurrencyCard[]>([]);

  const [previousSelectedCards, setPreviousSelectedCards] = useState<
    CurrencyCard[]
  >([]);

  const handlePick = (combination: Combination) => {
    setAvailableCombinations((prev) =>
      prev.filter((c) => c.id !== combination.id)
    );
    setPickedCombinations((prev) => [...prev, combination]);
    setCards((prev) => prev.filter((c) => !combination.cards.includes(c)));
  };

  const handleRemove = (combination: Combination) => {
    setPickedCombinations((prev) =>
      prev.filter((c) => c.id !== combination.id)
    );
    setAvailableCombinations((prev) => [...prev, combination]);
    setCards((prev) => [...prev, ...combination.cards]);
  };

  useEffect(() => {
    selectedCards = selectedCards.map((card) => {
      if (card.jokerAlternative) {
        const newCard = card.jokerAlternative;
        newCard.jokerCard = card;
        newCard.id = newCard.id + "-joker-card-" + card.id;
        return newCard;
      }

      return card;
    });

    // adding
    if (previousSelectedCards.length < selectedCards.length) {
      if (!pickedCombinations.length) {
        setCards(selectedCards);
        setPreviousSelectedCards(selectedCards);
        return;
      }

      const pickedCards = pickedCombinations
        .map((combination) => {
          return combination.cards;
        })
        .flat();

      setCards(selectedCards.filter((card) => !pickedCards.includes(card)));

      setPreviousSelectedCards(selectedCards);

      return;
    }

    // if (selectedCards.length === previousSelectedCards.length) {
    //   const differentCards = previousSelectedCards.filter(
    //     (card) => !selectedCards.includes(card)
    //   );

    //   if (differentCards.length > 1) {
    //     throw new Error("You can only add or remove one card at a time");
    //   }

    //   console.log("differentCards", differentCards);
    // }

    // // removing
    // if (previousSelectedCards.length > selectedCards.length) {
    const removedCards = previousSelectedCards.filter(
      (card) => !selectedCards.includes(card)
    );

    let pickedFiltered: Combination[] = [];

    setPickedCombinations((prev) => {
      pickedFiltered = prev.filter(
        (combination) =>
          !removedCards.some((removedCard) =>
            combination.cards.includes(removedCard)
          )
      );
      return pickedFiltered;
    });

    setAvailableCombinations((prev) =>
      prev.filter(
        (combination) =>
          !removedCards.some((removedCard) =>
            combination.cards.includes(removedCard)
          )
      )
    );

    if (!pickedFiltered.length) {
      setCards(selectedCards);
      setPreviousSelectedCards(selectedCards);
      return;
    }

    const pickedCards = pickedFiltered
      .map((combination) => {
        return combination.cards;
      })
      .flat();

    setCards(selectedCards.filter((card) => !pickedCards.includes(card)));

    setPreviousSelectedCards(selectedCards);
    // }

    // console.log("NOT DOING SHIT");
  }, [selectedCards]);

  useEffect(() => {
    if (!availableCombinations.length) {
      const shouldDoublePoints = pickedCombinations.some(
        (combination) => combination.variant === "straights"
      );
      const leftoversValue = getCardsValue(cards, shouldDoublePoints);
      const newTotalValue = pickedCombinations.reduce((acc, c) => {
        Object.entries(c.value).forEach(([suit, value]) => {
          const combSuit = suit as CardSuit;
          acc[combSuit] = (acc[combSuit] ?? 0) + value;
        });

        return acc;
      }, {} as CombinationValue);

      Object.entries(leftoversValue).forEach(([suit, value]) => {
        const combSuit = suit as CardSuit;
        newTotalValue[combSuit] = (newTotalValue[combSuit] ?? 0) + value;
      });

      setTotalValue(newTotalValue);
      return;
    }
    setTotalValue(null);
  }, [availableCombinations, cards, pickedCombinations]);

  useEffect(() => {
    const { straights } = calculateStraights(getSuitCurrencyGroups(cards));

    const { kinds } = calculateKinds(cards);

    const { doubles } = calculateDoubles(cards);

    if (!straights.length && !kinds.length && !doubles.length) {
      setAvailableCombinations([]);
      return;
    }

    setTotalValue(null);

    const combinations = [
      ...kinds.map((cards, i) => ({
        id: cards[i].id + "kinds" + i,
        variant: "kinds" as CombinationVariant,
        cards,
        value: getKindsValue(cards),
      })),
      ...straights.map((cards, i) => ({
        id: cards[i].id + "straights" + i,
        variant: "straights" as CombinationVariant,
        cards,
        value: getStraightsValue(cards),
      })),
      ...doubles.map((cards, i) => ({
        id: cards[i].id + "doubles" + i,
        variant: "doubles" as CombinationVariant,
        cards,
        value: getDoublesValue(cards),
      })),
    ];

    setAvailableCombinations(combinations);
  }, [cards]);

  return (
    <div className="w-full mt-4">
      <div className="flex gap-2">
        <div className="border border-foreground px-3 py-2 mt-2 rounded min-h-44 w-full shadow-card-sm">
          <h4 className="mb-1 text-sm">Available combinations</h4>
          <div className="flex flex-wrap gap-4">
            {availableCombinations.map((combination) => (
              <button
                onClick={() => handlePick(combination)}
                key={combination.id}
                className="p-2 rounded-sm border bg-gray-50 shadow-lg hover:shadow-2xl"
              >
                <div className="flex gap-1">
                  {combination.cards.map((card) => (
                    <Card key={card.id} size="sm" card={card} />
                  ))}
                </div>
                <ValueVisualisation value={combination.value} />
              </button>
            ))}
          </div>
        </div>
        <div className="border border-foreground px-3 py-2 mt-2 rounded min-h-44 w-full shadow-card-sm">
          <h4 className="mb-1 text-sm">Picked combinations</h4>
          <div className="flex flex-wrap gap-4">
            {pickedCombinations.map((combination) => (
              <button
                key={combination.id}
                onClick={() => handleRemove(combination)}
                className="p-2 rounded-sm border bg-gray-50 shadow-lg hover:shadow-2xl relative"
              >
                <div className="flex gap-1">
                  {combination.cards.map((card) => (
                    <Card key={card.id} size="sm" card={card} />
                  ))}
                </div>
                <ValueVisualisation value={combination.value} />
                <div className="absolute inset-0 opacity-0 hover:opacity-10 text-9xl">
                  X
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center border border-foreground px-3 py-2 mt-2 rounded shadow-card-sm">
        <div>
          <h4 className="text-sm mb-1">Total value</h4>
          <ValueVisualisation
            value={totalValue}
            className="justify-start mb-1"
          />
        </div>
        <Button
          className="px-16"
          disabled={!totalValue || isEmtpyObject(totalValue)}
        >
          Start the trade
        </Button>
      </div>
    </div>
  );
};
