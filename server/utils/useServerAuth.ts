import type { H3Event } from "h3";
import type { User } from "@supabase/supabase-js";
import { prisma } from "./useServerDatabase";
import { serverSupabaseUser } from "#supabase/server";

/**
 * Retrieves the authentication client from cookies.
 *
 * @param event - The H3Event object.
 * @returns A Promise that resolves to the authentication client or null if not found.
 */
export async function getAuthClient(event: H3Event) {
  const cookies = parseCookies(event);

  if (Object.keys(cookies).length !== 0) {
    const id = cookies["anomie-client-id"];

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

/**
 * Retrieves the authenticated user from cookies using Supabase.
 *
 * @param event - The H3Event object.
 * @returns A Promise that resolves to the authenticated user or null if not found.
 */
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
