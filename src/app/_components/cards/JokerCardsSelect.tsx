"use client";

import { getAllCardsOfAColor } from "@/actions/card/getAllCardsOfAColor";
import { CurrencyCard } from "@/types/game.types";
import { useEffect, useState } from "react";
import { Card } from "./Card";
import { DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const JokerCardsSelect = ({
  color,
  onCardSelect,
}: {
  color: CurrencyCard["color"];
  onCardSelect: (card: CurrencyCard | null) => void;
}) => {
  const [allCards, setAllCards] = useState<CurrencyCard[]>([]);

  useEffect(() => {
    const performSetAllCards = async (color: CurrencyCard["color"]) => {
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
        allCards.map((card) => (
          <DrawerClose key={card.id} asChild>
            <button onClick={() => onCardSelect(card)}>
              <Card size="sm" card={card} />
            </button>
          </DrawerClose>
        ))
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
