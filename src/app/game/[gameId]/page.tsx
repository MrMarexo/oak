import { LiveGame } from "@/scenes/game";
import { RoomForm } from "@/scenes/home";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: Promise<{ gameId: string }> }) => {
  const { gameId } = await params;
  const cookieStore = await cookies();
  const playerId = cookieStore.get("playerId");

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      players: true,
    },
  });

  const player = game?.players.find((player) => player.id === playerId?.value);

  return (
    <div>
      <div>
        {game ? (
          <>
            {player ? (
              <div>
                Welcome <b>{player.name}</b>!
                <LiveGame gameId={gameId} />
              </div>
            ) : (
              <RoomForm gameId={gameId} />
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
