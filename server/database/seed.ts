/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  // log: ["query", "error", "warn"],
});

async function main() {
  const build = await prisma.build.create({
    data: {
      id: "af1e214e-6491-4b1b-b88f-0073278fa3fb",
      codename: "AlphaZero",
      changelog: "http://example.com/changelog/4523l",
      buildDate: new Date().toISOString(),
      version: "0.0.1",
    },
  });

  const target = await prisma.target.create({
    data: {
      id: "8291d6d5-6aea-41a8-91f9-b227f4163799",
      name: "web-browser",
      description: "Target: Web Browser",
      platform: "web",
    },
  });

  await prisma.linkBuildAndTarget.create({
    data: {
      build: {
        connect: {
          id: build.id,
        },
      },
      target: {
        connect: {
          id: target.id,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });
