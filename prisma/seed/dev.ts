import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const sports = await prisma.sport.createMany({
    data: [
      {
        name: "Cycling",
      },
      { name: "Running" },
      { name: "Swimming" },
      { name: "Backcountry Skiing" },
    ],
  });

  console.log("Created sports", sports);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
