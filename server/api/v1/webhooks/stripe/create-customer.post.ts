import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  console.log("body:", body);
  consoleMessageServer("log", "body:", body);

  return await createStripeCustomer({
    event,
    name: body.record.id,
    email: body.record.email,
    phone: body.record.phone,
  });
});
