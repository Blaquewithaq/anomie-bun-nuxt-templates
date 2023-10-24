import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  return await createStripeCustomer({
    event,
    userId: body.record.id,
    name: body.record.id,
    email: body.record.email,
    phone: body.record.phone,
  });
});
