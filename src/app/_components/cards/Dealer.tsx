"use client";

import { getCardType, getSuitSymbol } from "@/helpers";
import {
  AnyCard,
  CharacterCard,
  CurrencyCard,
  Players,
} from "@/types/game.types";
import { IconOak } from "../icons/IconOak";

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

const Card = ({
  card,
  isDiscard,
  size = "lg",
}: {
  card?: AnyCard;
  isDiscard?: boolean;
  size?: "sm" | "lg";
}) => {
  return (
    <div
      className={`${size === "sm" ? "h-20 w-14" : "h-28 w-20"} border-[2px] flex rounded-md flex-col justify-center items-center border-foreground bg-background`}
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
                className={`${size === "sm" ? "text-md" : "text-lg"} font-bold`}
              >
                <ColoredSymbol
                  color={card.color}
                  value={getCardType(card.type)}
                />
              </div>
              <div className={size === "sm" ? "text-3xl" : "text-5xl"}>
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
    </div>
  );
};

export const Dealer = ({
  availableCharacters,
  currencyCardsInHand,
  players,
  playerId,
}: {
  availableCharacters: CharacterCard[];
  currencyCardsInHand: CurrencyCard[];
  players: Players;
  playerId: string;

  // setAvailableCharacters: (characters: CharacterCard[]) => void;
}) => {
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
          <div className="flex gap-3 flex-wrap">
            {currencyCardsInHand.map((card) => (
              <Card key={card.id} card={card} />
            ))}
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
