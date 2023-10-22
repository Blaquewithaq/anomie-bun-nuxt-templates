import type { H3Event } from "h3";
import { useServerStripe } from "#stripe/server";

export async function handleStripeWebhook(event: H3Event) {
  consoleMessageServer("log", "Function [stripe-webhook] up and running!");

  const stripe = await useServerStripe(event);

  consoleMessageServer("log", "stripe:", typeof stripe);
}
