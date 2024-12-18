import { GameForm } from "@/app/_components/forms/GameForm";
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
    </div>
  );
}
