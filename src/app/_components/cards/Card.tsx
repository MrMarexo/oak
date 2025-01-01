import { AnyCard, CurrencyCard } from "@/types/game.types";
import { IconOak } from "../icons/IconOak";
import { ColoredSymbol } from "./ColoredSymbol";
import { getCardType, getSuitSymbol } from "@/helpers";
import { JOKER_TYPE } from "@/consts";

export const Card = ({
  card,
  isDiscard,
  size = "lg",
  isSelected,
  jokerAlternative,
}: {
  card?: AnyCard;
  isDiscard?: boolean;
  size?: "sm" | "lg";
  isSelected?: boolean;
  jokerAlternative?: CurrencyCard;
}) => {
  if (jokerAlternative && card?.type === JOKER_TYPE) {
    card = jokerAlternative;
  }
  return (
    <div
      className={`${size === "sm" ? "h-20 w-14" : "h-28 w-20"} border-[2px] flex rounded-md flex-col justify-center items-center border-foreground bg-background relative`}
    >
      {card ? (
        <>
          {card.type === "Joker" ? (
            <div
              className={`${size === "sm" ? "text-sm" : "text-xl"} font-bold tracking-wide`}
            >
              <ColoredSymbol
                color={card.color}
                value={getCardType(card.type)}
              />
            </div>
          ) : (
            <>
              <div
                className={`${size === "sm" ? "text-md" : "text-lg"} font-bold ${jokerAlternative ? "opacity-30" : "opacity-100"}`}
              >
                <ColoredSymbol
                  color={card.color}
                  value={getCardType(card.type)}
                />
              </div>
              <div
                className={`${size === "sm" ? "text-3xl" : "text-5xl"} ${jokerAlternative ? "opacity-30" : "opacity-100"} `}
              >
                <ColoredSymbol
                  color={card.color}
                  value={getSuitSymbol(card.suit) ?? ""}
                />
              </div>
            </>
          )}
        </>
      ) : isDiscard ? (
        <div className={`${size === "sm" ? "text-xs" : "text-md"} font-bold`}>
          Discard
        </div>
      ) : (
        <IconOak
          width={size === "sm" ? 30 : 50}
          height={size === "sm" ? 30 : 50}
        />
      )}
      {isSelected && (
        <div className="absolute inset-0 border-4 border-orange-300 rounded-sm" />
      )}
      {jokerAlternative && card?.type === JOKER_TYPE && (
        <div className="absolute top-0 right-0 opacity-50">
          <Card card={jokerAlternative} />
        </div>
      )}
    </div>
  );
};
