declare global {
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
