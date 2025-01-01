"use client";

import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";

import { Dealer } from "@/app/_components/cards/Dealer";
import {
  PlayerName,
  Game,
  PlayerStatePrivate,
  DrawCardPlayerPrivateResponse,
  DrawCardGamePublicResponse,
} from "@/types/game.types";
import { getGameGeneralChannel, getGamePlayerChannel } from "@/helpers";
import { GAME_GENERAL_EVENTS, GAME_PLAYER_EVENTS } from "@/consts";
import { startGame } from "@/actions/game/startGame";
import { drawCard } from "@/actions/game/drawCard";
import { sortHandCards } from "@/actions/game/sortHandCards";

export const LiveGame = ({
  gameId,
  game: initialGame,
  player,
  playerPrivate,
}: {
  gameId: string;
  game: Game;
  player: PlayerName;
  playerPrivate: PlayerStatePrivate;
}) => {
  const [game, setGame] = useState<Game>(initialGame);
  const [playerPrivateState, setPlayerPrivateState] =
    useState<PlayerStatePrivate>(playerPrivate);

  useEffect(() => {
    const gameChannel = pusherClient.subscribe(getGameGeneralChannel(gameId));
    const playerChannel = pusherClient.subscribe(
      getGamePlayerChannel(gameId, player.privateId)
    );

    // PRIVATE PLAYER EVENTS
    playerChannel.bind(
      GAME_PLAYER_EVENTS.getCards,
      (data: PlayerStatePrivate) => {
        setPlayerPrivateState(data);
      }
    );
    playerChannel.bind(
      GAME_PLAYER_EVENTS.drawCard,
      (data: DrawCardPlayerPrivateResponse) => {
        setPlayerPrivateState(data);
      }
    );

    // PUBLIC GAME EVENTS
    gameChannel.bind(GAME_GENERAL_EVENTS.gameStart, (data: Game) => {
      setGame(data);
    });

    gameChannel.bind(
      GAME_GENERAL_EVENTS.playerDrawsCard,
      (data: DrawCardGamePublicResponse) => {
        setGame((prev) => {
          return {
            ...prev,
            currentPhase: data.currentPhase,
            numberOfCurrencyCardsLeft: data.numberOfCurrencyCardsLeft,
            players: prev.players.map((player) => {
              if (player.id === data.playerIdWithExtraCard) {
                return {
                  ...player,
                  numberOfCurrencyCardsInHand:
                    player.numberOfCurrencyCardsInHand + 1,
                };
              }
              return player;
            }),
          };
        });
      }
    );

    return () => {
      gameChannel.unbind(GAME_GENERAL_EVENTS.gameStart);
      playerChannel.unbind(GAME_PLAYER_EVENTS.getCards);

      pusherClient.unsubscribe(getGameGeneralChannel(gameId));
      pusherClient.unsubscribe(getGamePlayerChannel(gameId, player.privateId));
    };
  }, []);

  useEffect(() => {
    if (game.gameStatus !== "Playing") {
      return;
    }
    const isMyTurn = game.currentPlayer?.id === player.id;

    if (!isMyTurn) {
      return;
    }

    if (game.currentPhase === "Draw") {
      setTimeout(() => {
        drawCardHandle();
      }, 1000);
    }
  }, [game]);

  const drawCardHandle = async () => {
    try {
      await drawCard(gameId, player.privateId);
    } catch {
      alert("Error drawing card");
    }
  };

  const startGameHandle = async () => {
    try {
      await startGame(gameId);
    } catch {
      alert("Error starting game");
    }
  };

  const sortCurrencyCardsHandle = async (order: string[]) => {
    try {
      await sortHandCards({
        newCardOrder: order,
        playerPrivateId: player.privateId,
      });

      console.log("Cards sorted");

      return;
    } catch {
      alert("Error sorting cards");
    }
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {game.gameStatus === "Not_Initialized" && (
        <div className="mb-2">
          Welcome <b>{player.name}</b>!
        </div>
      )}
      {game.gameStatus === "Playing" && (
        <>
          <h2 className="text-center text-xl font-bold">
            Turn {game.currentTurn}
          </h2>
          <h2 className="text-lg text-center mb-5">{`${game.currentPlayer?.name}'s turn - ${game.currentPhase}`}</h2>
          <Dealer
            availableCharacters={game.characterCardsAvailable}
            currencyCardsInHand={playerPrivateState.currencyCardsInHand}
            players={game.players}
            playerId={player.id}
            saveCardOrder={sortCurrencyCardsHandle}
          />
        </>
      )}
      {game.gameStatus === "Not_Initialized" && player.isHost && (
        <Button onClick={startGameHandle}>Start game</Button>
      )}
    </div>
  );
};
