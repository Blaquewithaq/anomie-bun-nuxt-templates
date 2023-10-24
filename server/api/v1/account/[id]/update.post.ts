import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);

  if (!id || !body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return await updateAccountQuery({
    id,
    role: body.role,
    verified: body.verified,
    banned: body.banned,
  });
});
