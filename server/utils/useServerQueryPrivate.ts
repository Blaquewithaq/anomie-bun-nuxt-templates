import type { H3Event } from "h3";
import { useServerStripe } from "#stripe/server";
import { prisma } from "./useServerDatabase";

// Account

// Automatically created when auth user is created
// export async function createAccountQuery() {}

export async function updateAccountQuery({
  id,
  role,
  verified,
  banned,
  billing,
}: {
  id: string;
  role: AccountRole;
  verified: boolean;
  banned: boolean;
  billing: AccountBilling;
}): Promise<Account> {
  const _result = await prisma.account.update({
    where: {
      id,
    },
    data: {
      role,
      verified,
      banned,
      billing: billing
        ? {
            update: {
              stripeId: billing.stripeId,
              subscription: billing.subscription
                ? {
                    update: {
                      stripeSubscriptionId:
                        billing.subscription.stripeSubscriptionId,
                      productId: billing.subscription.productId,
                    },
                  }
                : undefined,
            },
          }
        : undefined,
    },
    include: {
      profile: true,
      billing: true,
    },
  });

  const result: Account = {
    id: _result.id,
    email: _result.email,
    phone: _result.phone || "",
    role: _result.role,
    verified: _result.verified,
    banned: _result.banned,
    profile: _result.profile || undefined,
    billing: _result.billing || undefined,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

// Automatically deleted when auth user is deleted
// export async function deleteAccountQuery() {}

export async function getAccountQuery({
  id,
}: {
  id: string;
}): Promise<Account | Error> {
  const _result = await prisma.account.findFirst({
    where: {
      id,
    },
    include: {
      profile: true,
      billing: true,
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

  const result: Account = {
    id: _result.id,
    email: _result.email,
    phone: _result.phone || "",
    role: _result.role,
    verified: _result.verified,
    banned: _result.banned,
    profile: _result.profile || undefined,
    billing: _result.billing || undefined,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

export async function getAccountsQuery(): Promise<Account[]> {
  const _result = await prisma.account.findMany({
    include: {
      profile: true,
      billing: true,
    },
  });

  const result: Account[] = _result.map((user) => {
    const _user: Account = {
      id: user.id,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      verified: user.verified,
      banned: user.banned,
      profile: user.profile || undefined,
      billing: user.billing || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return _user;
  });

  return result;
}

// Product

export async function createProductQuery({
  event,
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

  const _result = await prisma.product.create({
    data: {
      stripeProductId: product.id,
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
    stripeProductId: _result.stripeProductId,
    name: _result.name,
    description: _result.description ? _result.description : undefined,
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
  event,
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
  const stripe = await useServerStripe(event);

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

  const product = await stripe.products.update(_result.stripeProductId, {
    name,
    description,
    active,
    images: imageUrls,
  });

  if (!product) return sendErrorCode({ statusCode: 404 });

  const result: Product = {
    id: _result.id,
    stripeProductId: _result.stripeProductId,
    name: _result.name,
    description: _result.description ? _result.description : undefined,
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
  event: H3Event;
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
    stripeProductId: _result.stripeProductId,
    name: _result.name,
    description: _result.description ? _result.description : undefined,
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
    stripeProductId: _result.stripeProductId,
    name: _result.name,
    description: _result.description ? _result.description : undefined,
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
      stripeProductId: product.stripeProductId,
      name: product.name,
      description: product.description ? product.description : undefined,
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
