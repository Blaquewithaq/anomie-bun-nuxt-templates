import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  return await updateStripeCustomer({
    event,
    accountId: body.record.id,
    email: body.record.email,
    phone: body.record.phone,
    name: body.record.name,
  });
});
