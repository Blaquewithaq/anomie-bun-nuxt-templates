import type { H3Event } from "h3";
import { useServerStripe } from "#stripe/server";
import { prisma } from "./useServerDatabase";

export async function handleStripeWebhook(event: H3Event) {
  consoleMessageServer("log", "Function [stripe-webhook] up and running!");

  const stripe = await useServerStripe(event);

  consoleMessageServer("log", "stripe:", typeof stripe);
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

  const _result = await prisma.accountBilling.update({
    where: {
      id: accountId,
    },
    data: {
      stripeId: customer.id,
    },
  });

  const result: AccountBilling = {
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

  const account = await prisma.accountBilling.findUnique({
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

  const result: AccountBilling = {
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

  const account = await prisma.accountBilling.findUnique({
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
