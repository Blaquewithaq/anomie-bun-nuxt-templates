import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);

  if (!id || !body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return await updateBillingsQuery({
    id,
    codename: body.codename,
    changelog: body.changelog,
    buildDate: body.buildDate,
    version: body.version,
    targetIds: body.targetIds,
  });
});
