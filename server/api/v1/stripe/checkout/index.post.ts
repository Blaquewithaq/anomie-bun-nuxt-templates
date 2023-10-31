import type { H3Event } from "h3";

export default defineEventHandler(async (_event: H3Event) => {
  return await getStripeCheckoutSession();
});
