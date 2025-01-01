import { shuffleCardsGeneric } from "@/helpers";
import prisma from "@/lib/db";
import { Sort } from "@/scenes/swapy/Sort";
import { SwapyTest } from "@/scenes/swapy/SwapyTest";

const Page = async () => {
  const cards = await prisma.currencyCard.findMany({
    select: {
      id: true,
      suit: true,
      color: true,
      type: true,
      value: true,
    },
  });

  const shuffledCards = shuffleCardsGeneric(cards);
  return (
    <>
      {/* <SwapyTest allCards={shuffledCards} /> */}
      <Sort />
      <div className="h-20" />
    </>
  );
};

export default Page;
