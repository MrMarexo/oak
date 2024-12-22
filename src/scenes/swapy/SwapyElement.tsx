"use client";

import { CurrencyCard } from "@/types/game.types";
import { useEffect, useMemo, useRef, useState } from "react";
import { createSwapy, SlotItemMapArray, Swapy, utils } from "swapy";
import { getSuitSymbol, getCardType } from "../../helpers";

export const SwapyElement = ({
  cards,
  removeCard,
  setItemMap,
}: {
  cards: CurrencyCard[];
  removeCard: (id: CurrencyCard["id"]) => void;
  setItemMap: (itemMap: SlotItemMapArray) => void;
}) => {
  const swapy = useRef<Swapy | null>(null);
  const container = useRef<HTMLDivElement>(null);

  const [slotItemMap, setSlotItemMap] = useState(
    utils.initSlotItemMap(cards, "id")
  );

  const slottedItems = useMemo(
    () => utils.toSlottedItems(cards, "id", slotItemMap),
    [cards, slotItemMap]
  );

  useEffect(() => {
    // If container element is loaded
    if (container.current) {
      swapy.current = createSwapy(container.current!, {
        manualSwap: true,
      });

      // Your event listeners
      swapy.current.onSwap((event) => {
        setSlotItemMap(event.newSlotItemMap.asArray);

        console.log("swap", event);
      });

      swapy.current.onSwapEnd((event) => {
        setItemMap(event.slotItemMap.asArray);
      });
    }

    return () => {
      // Destroy the swapy instance on component destroy
      swapy.current?.destroy();
    };
  }, []);

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapy.current,
        cards,
        "id",
        slotItemMap,
        setSlotItemMap
      ),
    [cards]
  );

  return (
    <div className="flex gap-3" ref={container}>
      {slottedItems.map(({ item, itemId, slotId }) => {
        return (
          <div key={slotId} data-swapy-slot={slotId} className="bg-stone-100">
            {item && (
              <div
                key={itemId}
                data-swapy-item={itemId}
                className="h-32 w-24 border-2 border-neutral-950 p-2 flex flex-col items-center justify-center bg-stone-100 relative"
              >
                <>
                  <div>{getSuitSymbol(item.suit)}</div>
                  <div>{getCardType(item.type)}</div>
                  <button
                    className="absolute top-1 right-1 p-1 border"
                    onClick={() => removeCard(item.id)}
                  >
                    X
                  </button>
                </>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
