import type { H3Event } from "h3";
import { prisma } from "./useServerDatabase";

export async function createProductQuery({
  name,
  description,
  active,
  features,
  imageUrls,
  price,
  currency,
  recurringInterval,
  recurringCount,
}: {
  event: H3Event;
  name: string;
  description: string;
  active: boolean;
  features: string[];
  imageUrls: string[];
  price: string;
  currency: string;
  recurringInterval: "day" | "week" | "month" | "year";
  recurringCount: number;
}): Promise<Product> {
  const _result = await prisma.product.create({
    data: {
      name,
      description,
      active,
      features,
      imageUrls,
      price,
      currency,
      recurringInterval,
      recurringCount,
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

  return result;
}

export async function updateProductQuery({
  id,
  name,
  description,
  active,
  features,
  imageUrls,
}: {
  event: H3Event;
  id: string;
  name?: string;
  description?: string;
  active?: boolean;
  features?: string[];
  imageUrls?: string[];
}): Promise<Product> {
  const _result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      active,
      features,
      imageUrls,
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

  return result;
}

export async function deleteProductQuery({
  id,
}: {
  id: string;
}): Promise<Product> {
  const _result = await prisma.product.update({
    where: {
      id,
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

  return result;
}

export async function getProductQuery({
  id,
}: {
  id: string;
}): Promise<Product | Error> {
  const _result = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

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

  return result;
}

export async function getProductsQuery(): Promise<Product[]> {
  const _result = await prisma.product.findMany();

  const result: Product[] = _result.map((product) => {
    const _product: Product = {
      id: product.id,
      stripeProductId: product.stripeProductId || undefined,
      name: product.name,
      description: product.description || undefined,
      active: product.active,
      deleted: product.deleted,
      features: product.features,
      imageUrls: product.imageUrls,
      price: product.price,
      currency: product.currency,
      recurringInterval: product.recurringInterval as
        | "day"
        | "week"
        | "month"
        | "year",
      recurringCount: product.recurringCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return _product;
  });

  return result;
}
