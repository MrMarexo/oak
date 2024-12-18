-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('Not_Initialized', 'Playing', 'Ended');

-- CreateEnum
CREATE TYPE "GamePhase" AS ENUM ('Draw', 'Buying', 'Card_Exchange');

-- CreateEnum
CREATE TYPE "CardColor" AS ENUM ('Red', 'Black');

-- CreateEnum
CREATE TYPE "CardSuit" AS ENUM ('Spade', 'Heart', 'Diamond', 'Club');

-- CreateEnum
CREATE TYPE "CardCurrencyType" AS ENUM ('Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Joker');

-- CreateEnum
CREATE TYPE "CardCharacterType" AS ENUM ('King', 'Queen', 'Jack');

-- CreateEnum
CREATE TYPE "CardAceType" AS ENUM ('Ace');

-- CreateEnum
CREATE TYPE "CardClass" AS ENUM ('Currency', 'Character', 'Ace');

-- CreateEnum
CREATE TYPE "CardEffect" AS ENUM ('Draw2', 'StealOne', 'BuyOneExtra', 'StealFromHand');

-- CreateTable
CREATE TABLE "CurrencyCard" (
    "id" TEXT NOT NULL,
    "color" "CardColor" NOT NULL,
    "suit" "CardSuit",
    "type" "CardCurrencyType" NOT NULL,
    "value" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrencyCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterCard" (
    "id" TEXT NOT NULL,
    "color" "CardColor" NOT NULL,
    "suit" "CardSuit" NOT NULL,
    "type" "CardCharacterType" NOT NULL,
    "price" INTEGER NOT NULL,
    "effect" "CardEffect" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AceCard" (
    "id" TEXT NOT NULL,
    "color" "CardColor" NOT NULL,
    "suit" "CardSuit" NOT NULL,
    "type" "CardAceType" NOT NULL DEFAULT 'Ace',
    "effect" "CardEffect" NOT NULL DEFAULT 'StealFromHand',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AceCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerStatePrivate" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerStatePrivate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "privateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameIdForPlayers" TEXT NOT NULL,
    "gameIdForCurrentPlayer" TEXT,
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "numberOfCurrencyCardsInHand" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "privateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "gameStatus" "GameStatus" NOT NULL DEFAULT 'Not_Initialized',
    "currentTurn" INTEGER,
    "currentPhase" "GamePhase",
    "numberOfCurrencyCardsLeft" INTEGER NOT NULL DEFAULT 0,
    "numberOfCharacterCardsLeft" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatePrivate" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameStatePrivate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CurrencyCardToPlayerStatePrivate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CurrencyCardToPlayerStatePrivate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CurrencyCardsDeck" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CurrencyCardsDeck_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CurrencyCardsDiscard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CurrencyCardsDiscard_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CharacterCardToPlayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharacterCardToPlayer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CharacterCardToGame" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharacterCardToGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CharacterCardToGameStatePrivate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharacterCardToGameStatePrivate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AceCardToPlayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AceCardToPlayer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AceCardToGame" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AceCardToGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStatePrivate_playerId_key" ON "PlayerStatePrivate"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_privateId_key" ON "Player"("privateId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameIdForCurrentPlayer_key" ON "Player"("gameIdForCurrentPlayer");

-- CreateIndex
CREATE UNIQUE INDEX "Game_privateId_key" ON "Game"("privateId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStatePrivate_gameId_key" ON "GameStatePrivate"("gameId");

-- CreateIndex
CREATE INDEX "_CurrencyCardToPlayerStatePrivate_B_index" ON "_CurrencyCardToPlayerStatePrivate"("B");

-- CreateIndex
CREATE INDEX "_CurrencyCardsDeck_B_index" ON "_CurrencyCardsDeck"("B");

-- CreateIndex
CREATE INDEX "_CurrencyCardsDiscard_B_index" ON "_CurrencyCardsDiscard"("B");

-- CreateIndex
CREATE INDEX "_CharacterCardToPlayer_B_index" ON "_CharacterCardToPlayer"("B");

-- CreateIndex
CREATE INDEX "_CharacterCardToGame_B_index" ON "_CharacterCardToGame"("B");

-- CreateIndex
CREATE INDEX "_CharacterCardToGameStatePrivate_B_index" ON "_CharacterCardToGameStatePrivate"("B");

-- CreateIndex
CREATE INDEX "_AceCardToPlayer_B_index" ON "_AceCardToPlayer"("B");

-- CreateIndex
CREATE INDEX "_AceCardToGame_B_index" ON "_AceCardToGame"("B");

-- AddForeignKey
ALTER TABLE "PlayerStatePrivate" ADD CONSTRAINT "PlayerStatePrivate_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("privateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameIdForPlayers_fkey" FOREIGN KEY ("gameIdForPlayers") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameIdForCurrentPlayer_fkey" FOREIGN KEY ("gameIdForCurrentPlayer") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatePrivate" ADD CONSTRAINT "GameStatePrivate_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyCardToPlayerStatePrivate" ADD CONSTRAINT "_CurrencyCardToPlayerStatePrivate_A_fkey" FOREIGN KEY ("A") REFERENCES "CurrencyCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyCardToPlayerStatePrivate" ADD CONSTRAINT "_CurrencyCardToPlayerStatePrivate_B_fkey" FOREIGN KEY ("B") REFERENCES "PlayerStatePrivate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyCardsDeck" ADD CONSTRAINT "_CurrencyCardsDeck_A_fkey" FOREIGN KEY ("A") REFERENCES "CurrencyCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyCardsDeck" ADD CONSTRAINT "_CurrencyCardsDeck_B_fkey" FOREIGN KEY ("B") REFERENCES "GameStatePrivate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyCardsDiscard" ADD CONSTRAINT "_CurrencyCardsDiscard_A_fkey" FOREIGN KEY ("A") REFERENCES "CurrencyCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrencyCardsDiscard" ADD CONSTRAINT "_CurrencyCardsDiscard_B_fkey" FOREIGN KEY ("B") REFERENCES "GameStatePrivate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterCardToPlayer" ADD CONSTRAINT "_CharacterCardToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "CharacterCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterCardToPlayer" ADD CONSTRAINT "_CharacterCardToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterCardToGame" ADD CONSTRAINT "_CharacterCardToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "CharacterCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterCardToGame" ADD CONSTRAINT "_CharacterCardToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterCardToGameStatePrivate" ADD CONSTRAINT "_CharacterCardToGameStatePrivate_A_fkey" FOREIGN KEY ("A") REFERENCES "CharacterCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterCardToGameStatePrivate" ADD CONSTRAINT "_CharacterCardToGameStatePrivate_B_fkey" FOREIGN KEY ("B") REFERENCES "GameStatePrivate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AceCardToPlayer" ADD CONSTRAINT "_AceCardToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "AceCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AceCardToPlayer" ADD CONSTRAINT "_AceCardToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AceCardToGame" ADD CONSTRAINT "_AceCardToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "AceCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AceCardToGame" ADD CONSTRAINT "_AceCardToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
