declare global {
  type Billing = {
    id?: string;
    stripeId?: string | null;
    subscription?: BillingSubscription;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

export {};
