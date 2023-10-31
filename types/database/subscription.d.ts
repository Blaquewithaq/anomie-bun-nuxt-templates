declare global {
  type Subscription = {
    id?: string;
    stripeSubscriptionId?: string;
    productId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

export {};
