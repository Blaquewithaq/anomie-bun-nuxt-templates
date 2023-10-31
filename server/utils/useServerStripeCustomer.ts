import type { H3Event } from "h3";
import { useServerStripe } from "#stripe/server";
import { prisma } from "./useServerDatabase";

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

  let updateSuccessful = false;
  let retries = 3; // Number of retries before giving up

  while (retries > 0 && !updateSuccessful) {
    try {
      const _result = await prisma.billing.create({
        data: {
          accountId,
          stripeId: customer.id,
        },
      });

      updateSuccessful = true;

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
    } catch (error) {
      retries--;

      if (retries > 0) {
        consoleMessageServer("log", `Retrying in 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  return false;
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
      accountId,
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
      accountId,
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
