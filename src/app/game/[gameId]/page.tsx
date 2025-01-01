import { LiveGame } from "@/scenes/game/Game";
import { GameForm } from "@/app/_components/forms/GameForm";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import type { Game, PlayerName, PlayerStatePrivate } from "@/types/game.types";
import { orderCurrencyCards } from "@/helpers";

const Page = async ({ params }: { params: Promise<{ gameId: string }> }) => {
  const { gameId } = await params;
  const cookieStore = await cookies();
  const playerId = cookieStore.get("playerId");

  const game: Game | null = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    select: {
      title: true,
      gameStatus: true,
      aceCardsAvailable: {
        select: {
          suit: true,
          id: true,
          color: true,
          type: true,
        },
      },
      characterCardsAvailable: {
        select: {
          price: true,
          suit: true,
          id: true,
          effect: true,
          color: true,
          type: true,
        },
      },
      currentPhase: true,
      currentTurn: true,
      currentPlayer: {
        select: {
          name: true,
          id: true,
        },
      },
      numberOfCharacterCardsLeft: true,
      numberOfCurrencyCardsLeft: true,

      players: {
        select: {
          name: true,
          id: true,
          numberOfCurrencyCardsInHand: true,
          builtAces: {
            select: {
              suit: true,
              id: true,
              color: true,
              type: true,
            },
          },
          builtCharacterCards: {
            select: {
              price: true,
              suit: true,
              id: true,
              color: true,
              type: true,
            },
          },
        },
      },
    },
  });

  let player: PlayerName | null = null;
  let playerStatePrivate: PlayerStatePrivate | null = null;

  if (playerId) {
    player = await prisma.player.findUnique({
      where: {
        privateId: playerId.value,
        gameIdForPlayers: gameId,
      },
      select: {
        name: true,
        id: true,
        isHost: true,
        privateId: true,
      },
    });

    playerStatePrivate = await prisma.playerStatePrivate.findUnique({
      where: {
        playerId: playerId.value,
      },
      select: {
        currencyCardsInHand: {
          select: {
            id: true,
            suit: true,
            color: true,
            type: true,
            value: true,
          },
        },
        currencyCardsOrder: true,
      },
    });

    if (playerStatePrivate) {
      playerStatePrivate = {
        ...playerStatePrivate,
        currencyCardsInHand: orderCurrencyCards(
          playerStatePrivate.currencyCardsInHand,
          playerStatePrivate.currencyCardsOrder
        ),
      };
    }
  }

  return (
    <div>
      <div>
        {game ? (
          <>
            {player && playerStatePrivate ? (
              <LiveGame
                gameId={gameId}
                game={game}
                player={player}
                playerPrivate={playerStatePrivate}
              />
            ) : (
              <GameForm gameId={gameId} />
            )}
          </>
        ) : (
          <div>Game not found</div>
        )}
      </div>
    </div>
  );
};

export default Page;
