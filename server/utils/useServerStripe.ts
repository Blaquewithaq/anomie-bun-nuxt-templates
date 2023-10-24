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
  userId,
  description,
  email,
  metadata,
  name,
  phone,
}: {
  event: H3Event;
  userId: string;
  description?: string;
  email?: string;
  metadata?: Record<string, string>;
  name?: string;
  phone?: string;
}): Promise<PrivateAccountStripe> {
  const stripe = await useServerStripe(event);

  const customer = await stripe.customers.create({
    description,
    email,
    metadata,
    name,
    phone,
  });

  const _result = await prisma.accountStripe.update({
    where: {
      id: userId,
    },
    data: {
      customerId: customer.id,
    },
  });

  const result: PrivateAccountStripe = {
    id: _result.id,
    customerId: customer.id,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

export async function updateStripeCustomer({
  event,
  userId,
  description,
  email,
  metadata,
  name,
  phone,
}: {
  event: H3Event;
  userId: string;
  description?: string;
  email?: string;
  metadata?: Record<string, string>;
  name?: string;
  phone?: string;
}): Promise<PrivateAccountStripe | null> {
  const stripe = await useServerStripe(event);

  const account = await prisma.accountStripe.findUnique({
    where: {
      id: userId,
    },
  });

  if (!account?.customerId) {
    return null;
  }

  const customer = await stripe.customers.update(account?.customerId, {
    description,
    email,
    metadata,
    name,
    phone,
  });

  const result: PrivateAccountStripe = {
    id: account.id,
    customerId: customer.id,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };

  return result;
}

export async function deleteStripeCustomer({
  event,
  userId,
}: {
  event: H3Event;
  userId: string;
}): Promise<boolean> {
  const stripe = await useServerStripe(event);

  const account = await prisma.accountStripe.findUnique({
    where: {
      id: userId,
    },
  });

  if (!account?.customerId) {
    return false;
  }

  const customer = await stripe.customers.del(account?.customerId);

  if (!customer.deleted) {
    return false;
  }

  return true;
}
