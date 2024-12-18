"use client";

import { IconOak } from "../icons/IconOak";
import { AnyCard, CharacterCard, CurrencyCard } from "@/types/game.types";
import { getCardType, getSuitSymbol } from "@/helpers";

const ColoredSymbol = ({
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

const Card = ({ card, isDiscard }: { card?: AnyCard; isDiscard?: boolean }) => {
  return (
    <div className="h-28 w-20 border flex flex-col justify-center items-center border-foreground bg-background">
      {card ? (
        <>
          {card.type === "Joker" ? (
            <div className="text-xl font-bold tracking-wide">
              <ColoredSymbol
                color={card.color}
                value={getCardType(card.type)}
              />
            </div>
          ) : (
            <>
              <div className="text-lg font-bold">
                <ColoredSymbol
                  color={card.color}
                  value={getCardType(card.type)}
                />
              </div>
              <div className="text-5xl">
                <ColoredSymbol
                  color={card.color}
                  value={getSuitSymbol(card.suit) ?? ""}
                />
              </div>
            </>
          )}
        </>
      ) : isDiscard ? (
        <div>Discard</div>
      ) : (
        <IconOak width={50} height={50} />
      )}
    </div>
  );
};

export const Dealer = ({
  availableCharacters,
  currencyCardsInHand,
}: {
  availableCharacters: CharacterCard[];
  currencyCardsInHand: CurrencyCard[];

  // setAvailableCharacters: (characters: CharacterCard[]) => void;
}) => {
  return (
    <div>
      <div className="flex justify-between">
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
        <div className="flex gap-3 flex-wrap">
          {currencyCardsInHand.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};
