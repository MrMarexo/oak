"use client";

import { Card } from "@/app/_components/cards/Card";
import { sortCardsByValue } from "@/helpers";
import { CurrencyCard } from "@/types/game.types";
import { useState } from "react";
import { BuyVisualisation } from "./BuyVisualisation";

export const TestBuy = ({ cards }: { cards: CurrencyCard[] }) => {
  const [selectedCards, setSelectedCards] = useState<CurrencyCard[]>([]);

  const handleSelect = (card: CurrencyCard) => {
    setSelectedCards((prev) => {
      if (prev.find((c) => c.id === card.id)) {
        const newCards = prev.filter((c) => c.id !== card.id);
        return sortCardsByValue(newCards);
      }
      return sortCardsByValue([...prev, card]);
    });
  };

  return (
    <div>
      <h2 className="mt-4 text-lg">Choose cards:</h2>
      <div className="flex flex-wrap gap-1 mt-1 mb-4">
        {cards.map((card) => {
          const isSelected = selectedCards.find((c) => c.id === card.id);
          return (
            <button onClick={() => handleSelect(card)} key={card.id}>
              <Card size="sm" card={card} isSelected={!!isSelected} />
            </button>
          );
        })}
      </div>

      {/* <h2 className="mt-4 text-lg">Selected cards:</h2>
      <div className="flex flex-wrap gap-1 mt-1 mb-4">
        {selectedCards.map((card) => (
          <Card key={card.id} size="sm" card={card} />
        ))}
      </div> */}

      <div className="flex gap-1 justify-between mt-2">
        <BuyVisualisation selectedCards={selectedCards} />
      </div>
    </div>
  );
};
