import type { H3Event } from "h3";
import { useServerStripe } from "#stripe/server";
import { prisma } from "./useServerDatabase";

export async function createStripeCheckoutSession({
  event,
  productId,
}: {
  event: H3Event;
  productId: string;
}) {
  const stripe = await useServerStripe(event);

  const localSubscription = await prisma.subscription.findUnique({
    where: {
      id: productId,
    },
  });

  if (!localSubscription) {
    throw createError({
      statusCode: 404,
      statusMessage: "subscription not found",
    });
  }

  const subscription = await stripe.subscriptions.retrieve(
    localSubscription.stripeSubscriptionId,
  );

  // if (!subscription) {
  //   throw createError({
  //     statusCode: 404,
  //     statusMessage: "subscription not found"
  //   })
  // }

  const price = await stripe.prices.retrieve(
    subscription.items.data[0].price.id,
  );

  // if (!price) {
  //   throw createError({
  //     statusCode: 404,
  //     statusMessage: "price not found"
  //   })
  // }

  consoleMessageServer(
    "log",
    "localSubscription",
    localSubscription,
    "subscription",
    subscription,
    "price",
    price,
  );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/error`,
    line_items: [
      {
        price: "price_1O6fQtAUrVI709vDj38Gtkb9",
        quantity: 1,
      },
    ],
  });

  if (!session) {
    throw createError({
      statusCode: 500,
      statusMessage: "issue creating checkout session",
    });
  }

  return {
    url: session.url,
  };
}
