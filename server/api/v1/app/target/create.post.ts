import type { H3Event } from "h3";
import { z } from "zod";

export default defineEventHandler(async (event: H3Event) => {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    platform: z.string(),
    buildIds: z.array(z.string()).optional(),
  });

  const body = await readValidatedBody(event, schema.parse);

  return await createTargetQuery({
    name: body.name,
    description: body.description,
    platform: body.platform as AppTargetPlatform,
    buildIds: body.buildIds,
  });
});
