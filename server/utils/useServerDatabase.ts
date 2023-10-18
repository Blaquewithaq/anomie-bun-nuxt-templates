import { PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

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
      consoleMessageServer("log", "Query: " + event.query);
      consoleMessageServer("log", "Params: " + event.params);
      consoleMessageServer("log", "Duration: " + event.duration + "ms");
    });
  }

  return _prisma;
};

export const prisma = prismaClient();
