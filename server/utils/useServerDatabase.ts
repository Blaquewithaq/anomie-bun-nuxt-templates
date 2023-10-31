import type { DefaultArgs } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client";

/**
 * Represents an instance of the Prisma Client.
 */
let _prisma: PrismaClient<
  {
    log: (
      | {
          emit: "event";
          level: "query";
        }
      | {
          emit: "stdout";
          level: "error";
        }
      | {
          emit: "stdout";
          level: "info";
        }
      | {
          emit: "stdout";
          level: "warn";
        }
    )[];
  },
  "query",
  DefaultArgs
> | null = null;

/**
 * Initializes and returns the Prisma Client instance.
 *
 * @returns An instance of the Prisma Client.
 */
const prismaClient = (): PrismaClient<
  {
    log: (
      | {
          emit: "event";
          level: "query";
        }
      | {
          emit: "stdout";
          level: "error";
        }
      | {
          emit: "stdout";
          level: "info";
        }
      | {
          emit: "stdout";
          level: "warn";
        }
    )[];
  },
  "query",
  DefaultArgs
> => {
  if (!_prisma) {
    _prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? [
              {
                emit: "event",
                level: "query",
              },
              {
                emit: "stdout",
                level: "error",
              },
              {
                emit: "stdout",
                level: "info",
              },
              {
                emit: "stdout",
                level: "warn",
              },
            ]
          : [],
    });
  }

  if (process.env.NODE_ENV === "development") {
    _prisma.$on("query", (event) => {
      serverConsoleMessageDebug("log", "Query: " + event.query);
      serverConsoleMessageDebug("log", "Params: " + event.params);
      serverConsoleMessageDebug("log", "Duration: " + event.duration + "ms");
    });
  }

  return _prisma;
};

/**
 * Represents the Prisma Client instance.
 */
export const prisma = prismaClient();
