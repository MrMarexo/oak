import { AnyCard } from "@/types/game.types";

export const ColoredSymbol = ({
  color,
  value,
}: {
  color: AnyCard["color"];
  value: string;
}) => {
  if (color === "Black") {
    return <div className="text-gray-900">{value}</div>;
  }
  return <div className="text-red-900">{value}</div>;
};
