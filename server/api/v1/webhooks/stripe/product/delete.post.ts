import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  return await deleteStripeProduct({
    event,
    productId: body.record.id,
  });
});
