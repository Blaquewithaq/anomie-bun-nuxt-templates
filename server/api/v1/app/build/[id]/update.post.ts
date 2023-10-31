import type { H3Event } from "h3";
import { z } from "zod";

export default defineEventHandler(async (event: H3Event) => {
  const { id } = getRouterParams(event);

  if (!id) {
    return sendResponseCode(event, {
      statusCode: 400,
      statusMessage: "Missing: id",
    });
  }

  const schema = z.object({
    codename: z.string().optional(),
    changelog: z.string().optional(),
    buildDate: z.string().optional(),
    version: z.string().optional(),
    targetIds: z.array(z.string()).optional(),
  });

  const body = await readValidatedBody(event, schema.parse);

  return await updateBuildQuery(id, {
    codename: body.codename,
    changelog: body.changelog,
    buildDate: body.buildDate,
    version: body.version,
    targetIds: body.targetIds,
  });
});
