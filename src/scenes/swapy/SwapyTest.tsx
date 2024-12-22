"use client";

import { Button } from "@/components/ui/button";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";
import { SwapyElement } from "./SwapyElement";
import { CurrencyCard } from "@/types/game.types";
import { Demo, Item } from "./Demo";
import { SlotItemMapArray } from "swapy";
import { DemoCards } from "./DemoCards";

export const SwapyTest = ({ allCards }: { allCards: CurrencyCard[] }) => {
  const [deck, setDeck] = useState<CurrencyCard[]>(allCards);
  const [cards, setCards] = useState<CurrencyCard[]>([]);
  const [state, setState] = useState<"sort" | "exchange">("sort");

  const [items, setItems] = useState<Item[]>([
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 3" },
    { id: "4", title: "Item 4" },
  ]);

  useEffect(() => {
    const newCards = deck.slice(0, 5);
    setCards(newCards);
    setDeck((prev) => {
      return prev.filter((card) => !newCards.includes(card));
    });
  }, []);

  const handleOrderChange = (itemMap: SlotItemMapArray) => {
    // const newOrder = itemMap.map(({ item }) => {
    //   const newItem = allCards.find((card) => card.id === item)!;
    //   return newItem;
    // });
    // setCards(newOrder);
  };

  const addCard = () => {
    setCards((prev) => [...prev, deck[0]]);
    setDeck((prev) => prev.slice(1));
  };

  const removeLastCard = () => {
    setCards((prev) => prev.slice(0, prev.length - 1));
  };

  const removeCard = (id: CurrencyCard["id"]) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <>
      <div>DECK - {deck.length}</div>
      <div className="flex gap-4 mt-3">
        <Button className="bg-slate-500" onClick={addCard}>
          Add Card
        </Button>
        <Button className="bg-slate-500" onClick={removeLastCard}>
          Remove last card
        </Button>
      </div>
      <div className="flex gap-4 my-5">
        <Button
          className={
            state === "sort" ? "bg-green-400 hover:bg-green-300" : undefined
          }
          onClick={() => setState("sort")}
        >
          Sort cards in hand
        </Button>
        <Button
          className={
            state === "exchange" ? "bg-green-400 hover:bg-green-300" : undefined
          }
          onClick={() => setState("exchange")}
        >
          Exchange card
        </Button>
      </div>
      {/* <DndContext onDragEnd={handleDragEnd}> */}
      {/* <Droppable>{isDropped ? <div>Dropped</div> : "Drop here"}</Droppable> */}
      <div className="mt-40" />

      {state === "sort" ? (
        <SwapyElement
          cards={cards}
          removeCard={removeCard}
          setItemMap={(itemMap) => handleOrderChange(itemMap)}
        />
      ) : (
        <div className="flex gap-3">
          {cards.map((card) => (
            <Draggable key={card.id} id={card.id}>
              <div className="h-20 w-16 border-2 p-2 flex items-center justify-center">
                <div>{card.suit}</div>
                <div>{card.value}</div>
              </div>
            </Draggable>
          ))}
        </div>
      )}
      {/* </DndContext>
      {/* <Demo items={items} setItems={setItems} removeItems={} /> */}
    </>
  );
};
