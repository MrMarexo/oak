"use client";

import { createGame } from "@/actions/game/createGame";
import { joinGame } from "@/actions/game/joinGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const RoomForm = ({ gameId }: { gameId?: string }) => {
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (gameId) {
      const res = await joinGame({ playerName, gameId });
      if (res && "message" in res) {
        alert(res.message);
      }
    } else {
      const res = await createGame({ playerName });
      if (res && "message" in res) {
        alert(res.message);
      }
    }
  };
  return (
    <form
      className="mt-20 flex flex-col sm:max-w-[400px] gap-3"
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        name="playerName"
        placeholder="Your name"
        onChange={(e) => setPlayerName(e.target.value)}
        value={playerName}
      />
      <Button type="submit" className="" disabled={!playerName}>
        {gameId ? "Join game" : "Create game"}
      </Button>
    </form>
  );
};
