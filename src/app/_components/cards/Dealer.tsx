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
import { Fragment, use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconCheckmark } from "../icons/IconCheckmark";
import { DrawerComponent } from "../DrawerComponent";
import { IconJokerAction } from "../icons/IconJokerAction";
import { Card } from "./Card";
import { JokerCardsSelect } from "./JokerCardsSelect";
import { JOKER_TYPE } from "@/consts";

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
  const [selectedCurrencyTotal, setSelectedCurrencyTotal] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [selectedCurrencyCards, setSelectedCurrencyCards] = useState<
    CurrencyCard[]
  >([]);
  const [orderedHand, setOrderedHand] =
    useState<CurrencyCard[]>(currencyCardsInHand);

  const [jokerAlternatives, setJokerAlternatives] = useState<
    {
      jokerCard: CurrencyCard;
      alternativeCard: CurrencyCard;
    }[]
  >([]);

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

  useEffect(() => {
    let total = 0;
    selectedCurrencyCards.forEach((card) => {
      if (card.type === JOKER_TYPE) {
        const alternative = jokerAlternatives.find(
          (alt) => alt.jokerCard.id === card.id
        );
        if (alternative && alternative.alternativeCard.value) {
          total += alternative.alternativeCard.value;
          return;
        }
      }
      const value = card.value ?? 10;
      total += value;
    });

    setSelectedCurrencyTotal(total);
  }, [selectedCurrencyCards, jokerAlternatives]);

  const handleJokerAlternative = (
    jokerCard: CurrencyCard,
    alternativeCard: CurrencyCard | null
  ) => {
    if (!alternativeCard) {
      setJokerAlternatives((prev) =>
        prev.filter((alternative) => alternative.jokerCard.id !== jokerCard.id)
      );
      return;
    }

    const foundJoker = jokerAlternatives.find(
      (alt) => alt.jokerCard.id === jokerCard.id
    );
    if (foundJoker) {
      setJokerAlternatives((prev) =>
        prev.map((alternative) => {
          if (alternative.jokerCard.id === jokerCard.id) {
            return { jokerCard, alternativeCard };
          }
          return alternative;
        })
      );
      return;
    }

    setJokerAlternatives((prev) => [...prev, { jokerCard, alternativeCard }]);
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

  const handleToggleSelected = (card: CurrencyCard) => {
    if (selectedCurrencyCards.includes(card)) {
      setSelectedCurrencyCards((prev) =>
        prev.filter((curCard) => curCard.id !== card.id)
      );
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
        <div className="mt-96">
          <p>My hand</p>
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
              <div className="flex gap-3 flex-wrap">
                {orderedHand.map((card) => {
                  const jokerAlternative =
                    card.type === JOKER_TYPE
                      ? jokerAlternatives.find(
                          (alt) => alt.jokerCard.id === card.id
                        )
                      : null;
                  const isJoker = card.type === JOKER_TYPE;

                  if (isBuying) {
                    return (
                      <div
                        className="flex flex-col items-center gap-1"
                        key={card.id}
                      >
                        <button onClick={() => handleToggleSelected(card)}>
                          <Card
                            card={card}
                            isSelected={selectedCurrencyCards.includes(card)}
                            jokerAlternative={jokerAlternative?.alternativeCard}
                          />
                        </button>
                        {isJoker && (
                          <DrawerComponent
                            toggleChild={
                              <div className="px-1 border rounded-md hover:border-black">
                                <IconJokerAction height="20px" width="20px" />
                              </div>
                            }
                            title="Select card"
                          >
                            <JokerCardsSelect
                              color={card.color}
                              onCardSelect={(alternative) =>
                                handleJokerAlternative(card, alternative)
                              }
                            />
                          </DrawerComponent>
                        )}
                      </div>
                    );
                  }
                  return (
                    <SortableItem id={card.id} key={card.id}>
                      <div
                        className="flex flex-col items-center gap-1"
                        key={card.id + "sortable"}
                      >
                        <Card
                          card={card}
                          jokerAlternative={jokerAlternative?.alternativeCard}
                        />
                      </div>
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsBuying((prev) => !prev)}
            >
              {isBuying ? (
                <IconCheckmark fill="foreground" />
              ) : (
                <IconCheckmark fill="background" />
              )}
              Select cards to buy
            </Button>
            <div>Calculated value: {selectedCurrencyTotal}</div>
          </div>
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
