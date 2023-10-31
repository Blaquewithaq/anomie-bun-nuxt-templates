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
    name: z.string().optional(),
    description: z.string().optional(),
    platform: z.string().optional(),
    buildIds: z.array(z.string()).optional(),
  });

  const body = await readValidatedBody(event, schema.parse);

  return await updateTargetQuery(id, {
    name: body.name,
    description: body.description,
    platform: body.platform as AppTargetPlatform,
    buildIds: body.buildIds,
  });
});
