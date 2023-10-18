import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);

  if (!id || !body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return await updateTargetQuery({
    id,
    name: body.name,
    description: body.description,
    platform: body.platform,
    buildIds: body.buildIds,
  });
});
