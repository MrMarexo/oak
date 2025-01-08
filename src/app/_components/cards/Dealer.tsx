"use client";

import { CharacterCard, CurrencyCard, Players } from "@/types/game.types";
import { SortableItem } from "../sort/SortableItem";

import {
  closestCenter,
  DndContext,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerComponent } from "../DrawerComponent";
import { IconJokerAction } from "../icons/IconJokerAction";
import { Card } from "./Card";
import { SelectFromCards } from "./SelectFromCards";
import { JOKER_TYPE } from "@/consts";

import { BuyVisualisation } from "@/scenes/test/BuyVisualisation";

export const Dealer = ({
  availableCharacters,
  currencyCardsInHand,
  players,
  playerId,
  saveCardOrder,
}: {
  availableCharacters: CharacterCard[];
  currencyCardsInHand: CurrencyCard[];
  players: Players;
  playerId: string;
  saveCardOrder: (order: string[]) => void;

  // setAvailableCharacters: (characters: CharacterCard[]) => void;
}) => {
  const [waitingForJokerIds, setWaitingForJokerIds] = useState<string[]>([]);

  const [isSelectingCardsToBuy, setIsSelectingCardsToBuy] = useState(false);
  const [selectedCurrencyCards, setSelectedCurrencyCards] = useState<
    CurrencyCard[]
  >([]);
  const [orderedHand, setOrderedHand] =
    useState<CurrencyCard[]>(currencyCardsInHand);

  useEffect(() => {
    if (currencyCardsInHand.length > orderedHand.length) {
      setOrderedHand(currencyCardsInHand);
      return;
    }

    const checks: boolean[] = [];
    currencyCardsInHand.forEach((card, i) => {
      checks.push(card.id === orderedHand[i].id);
    });

    if (checks.every((check) => check)) {
      return;
    }
    saveCardOrder(orderedHand.map((card) => card.id));
  }, [currencyCardsInHand, orderedHand]);

  const handleJokerAlternative = (
    jokerCard: CurrencyCard,
    alternativeCard: CurrencyCard | null
  ) => {
    if (!alternativeCard && currencyCardsInHand.includes(jokerCard)) {
      // If the joker card is in the hand cant be null - later add to the drawer

      return;
    }

    if (waitingForJokerIds.includes(jokerCard.id)) {
      setWaitingForJokerIds((prev) => prev.filter((id) => id !== jokerCard.id));
      handleToggleSelected(jokerCard);
    }
    setOrderedHand((prev) => {
      const cards = prev.map((card) => {
        if (card.id === jokerCard.id) {
          card["jokerAlternative"] = alternativeCard ?? undefined;
          return card;
        }
        return card;
      });

      return cards;
    });

    setSelectedCurrencyCards((prev) => {
      const cards = prev.map((card) => {
        if (card.id === jokerCard.id) {
          card["jokerAlternative"] = alternativeCard ?? undefined;
          return card;
        }
        return card;
      });

      return cards;
    });
  };

  const handleDragEnd = (event: DragOverEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setOrderedHand((items) => {
        const oldIndex = items.indexOf(
          items.find((item) => item.id === active.id)!
        );
        const newIndex = items.indexOf(
          items.find((item) => item.id === over?.id)!
        );

        const ordered = arrayMove(items, oldIndex, newIndex);
        return ordered;
      });
    }
  };

  const handleToggleSelected = (
    card: CurrencyCard,
    drawerToggleId?: string
  ) => {
    if (selectedCurrencyCards.includes(card)) {
      setSelectedCurrencyCards((prev) =>
        prev.filter((curCard) => curCard.id !== card.id)
      );
      return;
    }

    if (card.type === JOKER_TYPE && drawerToggleId && !card.jokerAlternative) {
      document.getElementById(drawerToggleId)?.click();
      setWaitingForJokerIds((prev) => {
        if (prev.includes(card.id)) {
          return prev;
        }
        return [...prev, card.id];
      });
      return;
    }

    setSelectedCurrencyCards((prev) => [...prev, card]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const otherPlayers = players.filter((player) => player.id !== playerId);

  return (
    <div className="flex gap-10 justify-between">
      <div>
        <div className="flex justify-between gap-32">
          <div>
            <p>Character draft</p>
            <div className="flex gap-3 flex-wrap">
              <Card />
              {availableCharacters.map((card, i) => {
                if (i > 3) return null;
                return <Card key={card.id} card={card} />;
              })}
            </div>
          </div>
          <div>
            <p>Currency cards</p>
            <div className="flex gap-3 flex-wrap">
              <Card />
              <Card isDiscard />
            </div>
          </div>
        </div>
        <div className="mt-20">
          <p>My hand</p>
          <div className="flex gap-3">
            <Button
              variant={isSelectingCardsToBuy ? "outline" : "default"}
              onClick={() => setIsSelectingCardsToBuy(true)}
              className="my-2 w-48"
            >
              {isSelectingCardsToBuy ? "Selecting cards to buy" : "Buy cards"}
            </Button>
            <Button
              variant={!isSelectingCardsToBuy ? "outline" : "default"}
              onClick={() => setIsSelectingCardsToBuy(false)}
              className="my-2 w-48"
            >
              {isSelectingCardsToBuy ? "Sort hand" : "Sorting hand"}
            </Button>
          </div>
          <DndContext
            id={"dnd-kit-sort"}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={handleDragEnd}
          >
            <SortableContext
              items={orderedHand}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex gap-3 flex-wrap items-end">
                {orderedHand.map((card) => {
                  const isJoker = card.type === JOKER_TYPE;
                  const toggleId = "toggle-" + card.id;

                  if (isSelectingCardsToBuy) {
                    return (
                      <div
                        className="flex flex-col items-center gap-1"
                        key={card.id}
                      >
                        {isJoker && (
                          <DrawerComponent
                            toggleId={toggleId}
                            toggleChild={
                              <div className="px-1 border rounded-md hover:border-black">
                                <IconJokerAction height="20px" width="20px" />
                              </div>
                            }
                            title="Select card"
                          >
                            <SelectFromCards
                              color={card.color}
                              onCardSelect={(alternative) =>
                                handleJokerAlternative(card, alternative)
                              }
                            />
                          </DrawerComponent>
                        )}
                        <button
                          onClick={() => handleToggleSelected(card, toggleId)}
                        >
                          <Card
                            card={card}
                            isSelected={selectedCurrencyCards.includes(card)}
                          />
                        </button>
                      </div>
                    );
                  }
                  return (
                    <SortableItem id={card.id} key={card.id}>
                      <div
                        className="flex flex-col items-center gap-1"
                        key={card.id + "sortable"}
                      >
                        <div className="w-[30px] h-[22px]"></div>
                        <Card
                          card={card}
                          isSelected={selectedCurrencyCards.includes(card)}
                        />
                      </div>
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
          <BuyVisualisation selectedCards={selectedCurrencyCards} />
        </div>
      </div>
      <div>
        {otherPlayers.map((player) => (
          <div key={player.id}>
            <p>
              Player - <b>{player.name}</b>
            </p>
            <div className="flex gap-1">
              {Array.from({ length: player.numberOfCurrencyCardsInHand }).map(
                (_, i) => (
                  <div key={i} className="relative -ml-10">
                    <Card size="sm" />
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
