import type { H3Event } from "h3";
import type { User } from "@supabase/supabase-js";
import { prisma } from "./useServerDatabase";
import { serverSupabaseUser } from "#supabase/server";

export async function getAuthClient(event: H3Event) {
  const cookies = parseCookies(event);

  consoleMessageServer("log", "[anomie] av-client-id", cookies["av-client-id"]);

  if (Object.keys(cookies).length !== 0) {
    const id = cookies["av-client-id"];

    if (id === undefined) {
      return null;
    }

    const client = await prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (client !== null) {
      return client;
    }

    return null;
  } else {
    return null;
  }
}

export async function getAuthUser(event: H3Event): Promise<User | null> {
  const cookies = parseCookies(event);

  if (Object.keys(cookies).length !== 0) {
    const user = await serverSupabaseUser(event);

    if (user) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
