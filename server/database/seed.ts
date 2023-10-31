import { PrismaClient } from "@prisma/client";
import { buildId, targetId, clientId, accountId } from "~/tests/shared";
import {
  buildMock,
  targetMock,
  clientMock,
  accountMock,
} from "~/tests/shared/mock";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  // log: ["query", "error", "warn"],
});

async function main() {
  const build = await prisma.build.create({
    data: {
      id: buildId,
      codename: buildMock.codename,
      changelog: buildMock.changelog,
      buildDate: buildMock.buildDate,
      version: buildMock.version,
    },
  });

  const target = await prisma.target.create({
    data: {
      id: targetId,
      name: targetMock.name,
      description: targetMock.description,
      platform: targetMock.platform as AppTargetPlatform,
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
      id: clientId,
      online: clientMock.online,
      lastOnline: clientMock.lastOnline,
      disabled: clientMock.disabled,
      buildId: build.id,
      targetId: target.id,
      data: {
        create: {
          browserPropertiesAllowCollect:
            clientMock.data.browserPropertiesAllowCollect,
          browserProperties: clientMock.data.browserProperties,
        },
      },
    },
  });

  await prisma.account.create({
    data: {
      id: accountId,
      email: accountMock.email,
      phone: accountMock.phone,
      role: accountMock.role as AccountRole,
      verified: accountMock.verified,
      banned: accountMock.banned,
    },
  });

  await prisma.profile.create({
    data: {
      id: accountId,
      username: accountMock.username,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.log("seed.ts:", error);

    await prisma.$disconnect();

    process.exit(1);
  });
