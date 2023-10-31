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
    username: z.string().optional(),
  });

  const body = await readValidatedBody(event, schema.parse);

  return await updateProfileQuery(id, {
    username: body.username,
  });
});
