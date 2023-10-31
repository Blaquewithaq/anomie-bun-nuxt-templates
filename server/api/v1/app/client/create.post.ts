import type { H3Event } from "h3";
import { z } from "zod";

export default defineEventHandler(async (event: H3Event) => {
  const schema = z.object({
    online: z.boolean(),
    lastOnline: z.string(),
    disabled: z.boolean(),
    data: z.object({
      browserPropertiesAllowCollect: z.boolean().optional(),
      browserProperties: z.string().optional(),
    }),
    buildId: z.string(),
    targetId: z.string(),
  });

  const body = await readValidatedBody(event, schema.parse);

  return await createClientQuery({
    online: body.online,
    lastOnline: body.lastOnline,
    disabled: body.disabled,
    data: body.data,
    buildId: body.buildId,
    targetId: body.targetId,
  });
});
