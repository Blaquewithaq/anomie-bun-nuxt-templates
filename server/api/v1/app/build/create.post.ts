import type { H3Event } from "h3";
import { z } from "zod";

export default defineEventHandler(async (event: H3Event) => {
  const schema = z.object({
    codename: z.string(),
    changelog: z.string(),
    buildDate: z.string(),
    version: z.string(),
    targetIds: z.array(z.string()).optional(),
  });

  const body = await readValidatedBody(event, schema.parse);

  return await createBuildQuery({
    codename: body.codename,
    changelog: body.changelog,
    buildDate: body.buildDate,
    version: body.version,
    targetIds: body.targetIds,
  });
});
