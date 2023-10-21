import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  if (!body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return await createClientQuery({
    online: body.online,
    lastOnline: body.lastOnline,
    disabled: body.disabled,
    browserProperties: body.browserProperties,
    buildId: body.buildId,
    targetId: body.targetId,
  });
});
