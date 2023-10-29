import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  if (!body) {
    return sendResponseCode({ event, statusCode: 400 });
  }

  return await createProductQuery({
    event,
    name: body.name,
    description: body.description,
    features: body.features,
    imageUrls: body.imageUrls,
    price: body.price,
    currency: body.currency,
    recurringInterval: body.recurringInterval,
    recurringCount: body.recurringCount,
    active: body.active,
  });
});
