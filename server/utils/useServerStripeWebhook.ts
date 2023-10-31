import type { H3Event } from "h3";
import type Stripe from "stripe";
import { useServerStripe } from "#stripe/server";
// import { prisma } from "./useServerDatabase";

export async function handleStripeWebhook(event: H3Event) {
  const headers = event.node.req.headers;
  const body = await readRawBody(event);
  const sig = headers["stripe-signature"];

  const stripe = await useServerStripe(event);
  let hookEvent: Stripe.Event;

  try {
    hookEvent = stripe.webhooks.constructEvent(
      body as string,
      sig as string,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string,
    );
  } catch (err) {
    throw createError({ statusCode: 400, message: (err as Error).message });
  }

  // consoleMessageServer("log", "hookEvent:data:object", hookEvent.data.object)

  switch (hookEvent.type) {
    case "payment_intent.created": {
      consoleMessageServer("log", "payment_intent.created");
      break;
    }
    case "payment_intent.succeeded": {
      const intentSucceeded = hookEvent.data.object;
      consoleMessageServer("log", "payment_intent.succeeded", intentSucceeded);
      break;
    }
    case "charge.succeeded": {
      const chargeSucceeded = hookEvent.data.object;
      consoleMessageServer("log", "charge was successful!", chargeSucceeded);
      break;
    }
    default: {
      consoleMessageServer("log", `Unhandled event type ${hookEvent.type}`);
    }
  }

  return "ok";
}
