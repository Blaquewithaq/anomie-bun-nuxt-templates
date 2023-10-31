import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  return await updateStripeProduct({
    event,
    productId: body.record.id,
    name: body.record.id,
    description: body.record.email,
    active: body.record.active,
    imageUrls: body.record.imageUrls,
  });
});
