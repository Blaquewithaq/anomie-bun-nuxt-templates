import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);

  if (!id || !body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return await updateClientQuery({
    id,
    online: body.online,
    lastOnline: body.lastOnline,
    disabled: body.disabled,
    data: body.data,
    buildId: body.buildId,
    targetId: body.targetId,
  });
});
