"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

export const Droppable = ({ children }: { children?: ReactNode }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-32 w-24 bg-slate-700 p-2">
      {children}
    </div>
  );
};
