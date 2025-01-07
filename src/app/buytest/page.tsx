import prisma from "@/lib/db";
import { TestBuy } from "@/scenes/test/TestBuy";

const Page = async () => {
  const cards = await prisma.currencyCard.findMany({
    where: {
      type: {
        not: "Joker",
      },
    },
    select: {
      id: true,
      suit: true,
      color: true,
      type: true,
      value: true,
    },
  });

  return <TestBuy cards={cards} />;
};

export default Page;
