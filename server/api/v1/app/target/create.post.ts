import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  if (!body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return await createTargetQuery({
    name: body.name,
    description: body.description,
    platform: body.platform,
    buildIds: body.buildIds,
  });
});
