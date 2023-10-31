declare global {
  type AccountRole = "admin" | "user" | "beta" | "tester";

  type Account = {
    id?: string;
    email?: string;
    phone?: string;
    role?: AccountRole;
    verified?: boolean;
    banned?: boolean;
    profile?: Profile;
    createdAt?: Date;
    updatedAt?: Date;
  };

  type Billing = {
    id?: string;
    stripeId?: string | null;
    subscription?: BillingSubscription;
    createdAt?: Date;
    updatedAt?: Date;
  }

  type Subscription = {
    id?: string;
    stripeSubscriptionId?: string;
    productId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  type Product = {
    id?: string;
    stripeProductId?: string;
    name?: string;
    description?: string;
    active?: boolean;
    deleted?: boolean;
    features?: string[];
    imageUrls?: string[];
    price?: string;
    currency?: string;
    recurringInterval?: "day" | "week" | "month" | "year";
    recurringCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

export {};
