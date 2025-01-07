import { AnyCard } from "@/types/game.types";

export const ColoredSymbol = ({
  color,
  value,
}: {
  color: AnyCard["color"];
  value: string;
}) => {
  if (color === "Black") {
    return <span className="text-gray-900">{value}</span>;
  }
  return <span className="text-red-900">{value}</span>;
};
