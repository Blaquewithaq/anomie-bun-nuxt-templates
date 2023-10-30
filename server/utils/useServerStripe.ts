import type { H3Event } from "h3";
import type Stripe from "stripe";
import { useServerStripe } from "#stripe/server";
import { prisma } from "./useServerDatabase";

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

export async function createStripeCustomer({
  event,
  accountId,
  description,
  email,
  metadata,
  name,
  phone,
}: {
  event: H3Event;
  accountId: string;
  description?: string;
  email?: string;
  metadata?: Record<string, string>;
  name?: string;
  phone?: string;
}): Promise<boolean> {
  const stripe = await useServerStripe(event);

  const customer = await stripe.customers.create({
    description,
    email,
    metadata,
    name,
    phone,
  });

  const _result = await prisma.billing.update({
    where: {
      id: accountId,
    },
    data: {
      stripeId: customer.id,
    },
  });

  const result: Billing = {
    id: _result.id,
    stripeId: customer.id,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  if (!result) {
    return false;
  }

  return true;
}

export async function updateStripeCustomer({
  event,
  accountId,
  description,
  email,
  metadata,
  name,
  phone,
}: {
  event: H3Event;
  accountId: string;
  description?: string;
  email?: string;
  metadata?: Record<string, string>;
  name?: string;
  phone?: string;
}): Promise<boolean | null> {
  const stripe = await useServerStripe(event);

  const account = await prisma.billing.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!account?.stripeId) {
    return null;
  }

  const customer = await stripe.customers.update(account?.stripeId, {
    description,
    email,
    metadata,
    name,
    phone,
  });

  const result: Billing = {
    id: account.id,
    stripeId: customer.id,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };

  if (!result) {
    return false;
  }

  return true;
}

export async function deleteStripeCustomer({
  event,
  accountId,
}: {
  event: H3Event;
  accountId: string;
}): Promise<boolean> {
  const stripe = await useServerStripe(event);

  const account = await prisma.billing.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!account?.stripeId) {
    return false;
  }

  const customer = await stripe.customers.del(account?.stripeId);

  if (!customer.deleted) {
    return false;
  }

  return true;
}

export async function createStripeProduct({
  event,
  productId,
  name,
  description,
  active,
  // features,
  imageUrls,
  price,
  currency,
  recurringInterval,
  recurringCount,
}: {
  event: H3Event;
  productId: string;
  name: string;
  description: string;
  active: boolean;
  // features: string[];
  imageUrls: string[];
  price: string;
  currency: string;
  recurringInterval: "day" | "week" | "month" | "year";
  recurringCount: number;
}): Promise<boolean> {
  const stripe = await useServerStripe(event);

  const product = await stripe.products.create({
    name,
    description,
    active,
    images: imageUrls,
    default_price_data: {
      currency,
      unit_amount: parseFloat(price) * 100,
      recurring: {
        interval: recurringInterval,
        interval_count: recurringCount,
      },
    },
  });

  const _result = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      stripeProductId: product.id,
    },
  });

  const result: Product = {
    id: _result.id,
    stripeProductId: _result.stripeProductId || undefined,
    name: _result.name,
    description: _result.description || undefined,
    active: _result.active,
    deleted: _result.deleted,
    features: _result.features,
    imageUrls: _result.imageUrls,
    price: _result.price,
    currency: _result.currency,
    recurringInterval: _result.recurringInterval as
      | "day"
      | "week"
      | "month"
      | "year",
    recurringCount: _result.recurringCount,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  if (!result) {
    return false;
  }

  return true;
}

export async function updateStripeProduct({
  event,
  productId,
  name,
  description,
  active,
  // features,
  imageUrls,
}: {
  event: H3Event;
  productId: string;
  name?: string;
  description?: string;
  active?: boolean;
  // features?: string[];
  imageUrls?: string[];
}): Promise<boolean> {
  const stripe = await useServerStripe(event);

  const _result = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!_result?.stripeProductId) {
    return false;
  }

  const product = await stripe.products.update(_result.stripeProductId, {
    name,
    description,
    active,
    images: imageUrls,
  });

  if (!product) return false;

  const result: Product = {
    id: _result.id,
    stripeProductId: _result.stripeProductId,
    name: _result.name,
    description: _result.description || undefined,
    active: _result.active,
    deleted: _result.deleted,
    features: _result.features,
    imageUrls: _result.imageUrls,
    price: _result.price,
    currency: _result.currency,
    recurringInterval: _result.recurringInterval as
      | "day"
      | "week"
      | "month"
      | "year",
    recurringCount: _result.recurringCount,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  if (!result) {
    return false;
  }

  return true;
}

export async function deleteStripeProduct({
  productId,
}: {
  event: H3Event;
  productId: string;
}): Promise<boolean> {
  const _result = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      active: false,
      deleted: true,
    },
  });

  const result: Product = {
    id: _result.id,
    stripeProductId: _result.stripeProductId || undefined,
    name: _result.name,
    description: _result.description || undefined,
    active: _result.active,
    deleted: _result.deleted,
    features: _result.features,
    imageUrls: _result.imageUrls,
    price: _result.price,
    currency: _result.currency,
    recurringInterval: _result.recurringInterval as
      | "day"
      | "week"
      | "month"
      | "year",
    recurringCount: _result.recurringCount,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  if (!result) {
    return false;
  }

  return true;
}
