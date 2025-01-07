import { removeAll } from "@/actions/admin/removeAll";
import { listActiveChannels } from "@/actions/user/listActiveChannels";
import { GameForm } from "@/app/_components/forms/GameForm";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const games = await prisma.game.findMany();

  return (
    <div>
      <h2>Games:</h2>
      <div className="flex gap-2 mb-12">
        {games.length ? (
          games.map((game) => (
            <Link
              href={`game/${game.id}`}
              key={game.id}
              className="border px-2 border-foreground rounded"
            >
              <h3>{game.title}</h3>
            </Link>
          ))
        ) : (
          <p>No games</p>
        )}
      </div>
      <GameForm />
      <div className="flex gap-2">
        <Button className="mt-10" onClick={listActiveChannels}>
          List all channels
        </Button>
        <Button className="mt-10" onClick={removeAll}>
          Delete all games and players
        </Button>
      </div>
    </div>
  );
}
