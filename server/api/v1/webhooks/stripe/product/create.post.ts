import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  return await createStripeProduct({
    event,
    productId: body.record.id,
    name: body.record.id,
    description: body.record.email,
    active: body.record.active,
    features: body.record.features,
    imageUrls: body.record.imageUrls,
    price: body.record.price,
    currency: body.record.currency,
    recurringInterval: body.record.recurringInterval,
    recurringCount: body.record.recurringCount,
  });
});
