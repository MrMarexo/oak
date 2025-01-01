"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { SortableItem } from "@/app/_components/sort/SortableItem";

export const Sort = () => {
  const [state, setState] = useState<"sort" | "exchange">("sort");
  const [items, setItems] = useState([
    { id: "blah", title: "Blah" },
    { id: "yolo", title: "Yolo" },
    { id: "marexo", title: "Marexo" },
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  console.log("items", items);

  const handleDragEnd = (event: DragOverEvent) => {
    const { active, over } = event;

    console.log("active", active);
    console.log("over", over);

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(
          items.find((item) => item.id === active.id)!
        );
        const newIndex = items.indexOf(
          items.find((item) => item.id === over?.id)!
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
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
      <DndContext
        id={"dnd-kit-sort"}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex gap-4">
            {state === "sort" ? (
              <>
                {items.map(({ id }) => (
                  <SortableItem key={id} id={id}>
                    <div className="bg-orange-400 p-4 size-20 relative">
                      Item {id}
                      <button
                        className="absolute top-0 right-0 p-1"
                        onClick={() =>
                          setItems((prev) =>
                            prev.filter((item) => item.id !== id)
                          )
                        }
                      >
                        X
                      </button>
                    </div>
                  </SortableItem>
                ))}
              </>
            ) : (
              <>
                {items.map(({ id }) => (
                  <div className="bg-orange-400 p-4 size-20 relative" key={id}>
                    Item {id}
                    <button
                      className="absolute top-0 right-0 p-1"
                      onClick={() =>
                        setItems((prev) =>
                          prev.filter((item) => item.id !== id)
                        )
                      }
                    >
                      X
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          {/* <button
            onClick={() => {
              setItems([...items, { id: (items.length + 1).toString() }]);
            }}
          >
            +
          </button> */}
        </SortableContext>
      </DndContext>
    </>
  );
};
