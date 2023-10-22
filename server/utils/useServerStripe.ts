import type { H3Event } from "h3";
import { useServerStripe } from "#stripe/server";

export async function handleStripeWebhook(event: H3Event) {
  consoleMessageServer("log", "Function [stripe-webhook] up and running!");

  const stripe = await useServerStripe(event);

  consoleMessageServer("log", "stripe:", typeof stripe);
}

export async function createStripeCustomer({
  event,
  description,
  email,
  metadata,
  name,
  phone,
}: {
  event: H3Event;
  description?: string;
  email?: string;
  metadata?: Record<string, string>;
  name?: string;
  phone?: string;
}): Promise<string> {
  const stripe = await useServerStripe(event);

  const result = await stripe.customers.create({
    description,
    email,
    metadata,
    name,
    phone,
  });

  console.log("stripe customer:", result);

  return result.id;
}

// export async function updateStipeCustomer(event: H3Event) {}

// export async function deleteStripeCustomer(event: H3Event) {}
