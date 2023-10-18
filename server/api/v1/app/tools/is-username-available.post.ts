import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  if (!body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return isUsernameAvailable(body.email);
});
