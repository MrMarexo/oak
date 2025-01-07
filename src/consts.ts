import { CurrencyCard } from "./types/game.types";

export const GAME_GENERAL_EVENTS = {
  gameStart: "game-start",
  playerDrawsCard: "player-draws-card",
};

export const GAME_PLAYER_EVENTS = {
  getCards: "get-cards",
  drawCard: "draw-card",
};

export const JOKER_TYPE: CurrencyCard["type"] = "Joker";
