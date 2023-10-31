import type { H3Event } from "h3";
import { useServerStripe } from "#stripe/server";
import { prisma } from "./useServerDatabase";

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
