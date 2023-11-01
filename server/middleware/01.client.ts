import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const isClientAllowed = await protectClientRoute(event);

  serverConsoleMessageDebug("log", "[anomie] isClientAllowed", isClientAllowed);

  if (!isClientAllowed) {
    return sendResponseCode(event, { statusCode: 401 });
  }
});

async function protectClientRoute(event: H3Event): Promise<boolean> {
  const protectedRoutes = [
    "/api/v1/app/build",
    "/api/v1/app/target",
    "/api/v1/app/validator",
    "/api/v1/account",
    "/api/v1/profile",
  ];

  if (
    event.path === undefined ||
    !protectedRoutes.some((route) => event.path?.startsWith(route))
  ) {
    return true;
  } else {
    const client = await getAuthClient(event);

    serverConsoleMessageDebug("log", "[anomie] clientRecord", client);

    if (!client) {
      return false;
    }
  }
  return true;
}