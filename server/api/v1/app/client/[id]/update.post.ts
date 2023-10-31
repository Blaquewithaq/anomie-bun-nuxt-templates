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
    online: z.boolean().optional(),
    lastOnline: z.string().optional(),
    disabled: z.boolean().optional(),
    data: z.object({
      browserPropertiesAllowCollect: z.boolean().optional(),
      browserProperties: z.string().optional(),
    }),
    buildId: z.string().optional(),
    targetId: z.string().optional(),
  });

  const body = await readValidatedBody(event, schema.parse);

  return await updateClientQuery(id, {
    online: body.online,
    lastOnline: body.lastOnline,
    disabled: body.disabled,
    data: body.data,
    buildId: body.buildId,
    targetId: body.targetId,
  });
});
