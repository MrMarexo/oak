const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seed = async () => {
  // Enums
  const colors = ["Red", "Black"] as const;
  const suits = ["Spade", "Heart", "Diamond", "Club"] as const;
  const currencyTypes = [
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Joker",
  ] as const;
  const characterTypes = ["King", "Queen", "Jack"] as const;
  const aceTypes = ["Ace"] as const;
  const effects = [
    "Draw2",
    "StealOne",
    "BuyOneExtra",
    "StealFromHand",
  ] as const;

  // Create Currency Cards
  for (const suit of suits) {
    for (const type of currencyTypes) {
      let value: number | undefined = currencyTypes.indexOf(type) + 2; // Value 2-10
      if (type === "Joker") {
        value = undefined;
      }
      const color: (typeof colors)[number] =
        suit === "Heart" || suit === "Diamond" ? "Red" : "Black";
      const newSuit = type === "Joker" ? undefined : suit;
      const data = {
        color,
        suit: newSuit,
        type,
        value,
      };
      await prisma.currencyCard.create({
        data,
      });
      if (type !== "Joker") {
        await prisma.currencyCard.create({
          data,
        });
      }
    }
  }

  // Create Character Cards
  for (const suit of suits) {
    for (const type of characterTypes) {
      const color: (typeof colors)[number] =
        suit === "Heart" || suit === "Diamond" ? "Red" : "Black";
      const effect: (typeof effects)[number] =
        type === "King"
          ? "BuyOneExtra"
          : type === "Queen"
            ? "StealOne"
            : "Draw2";
      const data = {
        color,
        suit,
        type,
        price: type === "King" ? 30 : type === "Queen" ? 20 : 10,
        effect,
      };
      await prisma.characterCard.create({
        data,
      });
      await prisma.characterCard.create({
        data,
      });
    }
  }

  // Create Ace Cards
  for (const suit of suits) {
    const color: (typeof colors)[number] =
      suit === "Heart" || suit === "Diamond" ? "Red" : "Black";
    const data = {
      color,
      suit,
      type: aceTypes[0], // Always "Ace"
      effect: effects[3], // Default "StealFromHand"
    };
    await prisma.aceCard.create({ data });
    await prisma.aceCard.create({ data });
  }

  console.log("Seeding complete!");
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
