"use client";

import { getAllCardsOfAColor } from "@/actions/card/getAllCardsOfAColor";
import { CurrencyCard } from "@/types/game.types";
import { useEffect, useState } from "react";
import { Card } from "./Card";
import { DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const SelectFromCards = ({
  onCardSelect,
  color,
}: {
  onCardSelect: (card: CurrencyCard | null) => void;
  color?: CurrencyCard["color"];
}) => {
  const [allCards, setAllCards] = useState<CurrencyCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<CurrencyCard[]>([]);

  const handleSelect = (card: CurrencyCard) => {
    setSelectedCards((prev) => {
      if (prev.find((c) => c.id === card.id)) {
        return prev.filter((c) => c.id !== card.id);
      }
      return [...prev, card];
    });
    onCardSelect(card);
  };

  useEffect(() => {
    const performSetAllCards = async (color?: CurrencyCard["color"]) => {
      const allCards = await getAllCardsOfAColor(color);
      setAllCards(allCards);
    };

    if (allCards.length > 0 && allCards[0].color === color) {
      return;
    }
    performSetAllCards(color);
  }, [color]);
  return (
    <div className="flex flex-wrap gap-1">
      {allCards.length ? (
        allCards.map((card) => {
          const isSelected = selectedCards.find((c) => c.id === card.id);
          return (
            <DrawerClose key={card.id} asChild>
              <button onClick={() => handleSelect(card)}>
                <Card size="sm" card={card} isSelected={!!isSelected} />
              </button>
            </DrawerClose>
          );
        })
      ) : (
        <div className="h-20">Loading...</div>
      )}
      {allCards.length && (
        <DrawerClose asChild>
          <Button onClick={() => onCardSelect(null)}>Clear selection</Button>
        </DrawerClose>
      )}
    </div>
  );
};
