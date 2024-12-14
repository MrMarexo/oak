"use client";

import { ReactNode, useEffect, useState } from "react";
import { IconOak } from "../icons/IconOak";

type CardSuit = "♥️" | "♦️" | "♣️" | "♠️";
type CardCurrencyValue = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
type CardCharacterValue = "J" | "Q" | "K";
type CardAceValue = "A";

type CardCurrency = {
  id: string;
  value: CardCurrencyValue;
  suit: CardSuit;
};

type CardCharacter = {
  id: string;
  value: CardCharacterValue;
  suit: CardSuit;
};

type CardAce = {
  id: string;
  value: CardAceValue;
  suit: CardSuit;
};

type Card = CardCurrency | CardCharacter | CardAce;

type Player = {
  id: string;
  name: string;
  hand: Card[];
};

type GameState = {
  currentPlayer: string;
  currentTurn: number;
  currentPhase: string;
};

const shuffleDeckGeneric = <T extends Card>(deck: T[]): T[] => {
  deck.sort(() => Math.random() - 0.5);
  return deck;
};

const buildADeckOfCards = () => {
  const suits: CardSuit[] = ["♥️", "♦️", "♣️", "♠️"];
  const currencyValues: CardCurrencyValue[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];
  const characterValues: CardCharacterValue[] = ["J", "Q", "K"];
  const aceValues: CardAceValue[] = ["A"];

  const currencyDeck: CardCurrency[] = [];
  const characterDeck: CardCharacter[] = [];
  const aceDeck: CardAce[] = [];
  currencyValues.forEach((value) => {
    suits.forEach((suit) => {
      currencyDeck.push({ id: `${value}-${suit}-1`, value, suit });
      currencyDeck.push({ id: `${value}-${suit}-2`, value, suit });
    });
  });

  characterValues.forEach((value) => {
    suits.forEach((suit) => {
      characterDeck.push({ id: `${value}-${suit}-1`, value, suit });
      characterDeck.push({ id: `${value}-${suit}-2`, value, suit });
    });
  });

  aceValues.forEach((value) => {
    suits.forEach((suit) => {
      aceDeck.push({ id: `${value}-${suit}-1`, value, suit });
      aceDeck.push({ id: `${value}-${suit}-2`, value, suit });
    });
  });

  return {
    currencyDeck: shuffleDeckGeneric(currencyDeck),
    characterDeck: shuffleDeckGeneric(characterDeck),
    aceDeck: shuffleDeckGeneric(aceDeck),
  };
};

const ColoredSymbol = ({ suit, value }: { suit: CardSuit; value: string }) => {
  if (suit === "♣️" || suit === "♠️") {
    return <div className="text-gray-900">{value}</div>;
  }
  return <div className="text-red-900">{value}</div>;
};

const Card = ({ card, isDiscard }: { card?: Card; isDiscard?: boolean }) => {
  return (
    <div className="h-28 w-20 border flex flex-col justify-center items-center bg-foreground">
      {card ? (
        <>
          <div className="text-lg font-bold">
            <ColoredSymbol suit={card.suit} value={card.value} />
          </div>
          <div className="text-5xl">
            <ColoredSymbol suit={card.suit} value={card.suit} />
          </div>
        </>
      ) : isDiscard ? (
        <div className="text-background">Discard</div>
      ) : (
        <IconOak className="text-background" width={50} height={50} />
      )}
    </div>
  );
};

const PLAYER_NUMBER = 2;

export const Dealer = () => {
  const [currencyDeck, setCurrencyDeck] = useState<CardCurrency[]>([]);
  const [characterDeck, setCharacterDeck] = useState<CardCharacter[]>([]);
  const [aceDeck, setAceDeck] = useState<CardAce[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [gameState, setGameState] = useState<GameState>();

  const handleStartGame = () => {
    setGameState((old) => {
      if (!old) return old;
      return {
        ...old,
        currentTurn: 1,
        currentPhase: "start",
      };
    });
  };

  useEffect(() => {
    const { currencyDeck, characterDeck, aceDeck } = buildADeckOfCards();
    setCharacterDeck(characterDeck);
    setAceDeck(aceDeck);
    const currencyDeckCopy = [...currencyDeck];
    const players = Array.from({ length: PLAYER_NUMBER }).map((_, i) => {
      const hand = currencyDeckCopy.splice(0, 5);
      return {
        id: `${i}`,
        name: `Player ${i}`,
        hand,
      };
    });
    setPlayers(players);

    setCurrencyDeck(currencyDeckCopy);
    setGameState({
      currentPlayer: players[0].id,
      currentTurn: 0,
      currentPhase: "draft",
    });
  }, []);

  console.log("CHAR", characterDeck);
  console.log("CURR", currencyDeck);
  console.log("PLAYERS", players);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p>Character draft</p>
          <div className="flex gap-3 flex-wrap">
            <Card />
            {characterDeck.map((card, i) => {
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
          {players[0]?.hand.map((card, i) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
      {gameState?.currentTurn === 0 && (
        <button className="mt-5 border px-3 py-1" onClick={handleStartGame}>
          Start game
        </button>
      )}
    </div>
  );
};
