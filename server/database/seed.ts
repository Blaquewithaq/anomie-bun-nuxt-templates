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

  await prisma.client.create({
    data: {
      id: "d2f5c1c2-0c2d-4d5d-9a1b-1d4f5d2c0c2d",
      online: true,
      lastOnline: new Date().toISOString(),
      disabled: false,
      buildId: build.id,
      targetId: target.id,
      data: {
        create: {
          browserPropertiesAllowCollect: true,
          browserProperties: {
            userAgent:
              "Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Mobile Safari/537.36",
          },
        },
      },
    },
  });

  await prisma.account.create({
    data: {
      id: "b7a8a3b0-1f7e-4f1f-8e1c-0f4b9e3d6f8c",
      email: "test@test.com",
      phone: "1234567890",
      role: "user",
      verified: true,
      banned: false,
    },
  });

  await prisma.profile.create({
    data: {
      id: "b7a8a3b0-1f7e-4f1f-8e1c-0f4b9e3d6f8c",
      username: "Test",
    },
  });

  await prisma.billing.create({
    data: {
      id: "b7a8a3b0-1f7e-4f1f-8e1c-0f4b9e3d6f8c",
      stripeId: null,
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
