declare global {
  type PrivateAccountRole = "admin" | "user" | "beta" | "tester";

  type PrivateAccountStripe = {
    id: string;
    customerId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  type PrivateAccount = {
    id: string;
    email: string;
    phone: string;
    role: PublicUserRole;
    verified: boolean;
    banned: boolean;
    profile?: PublicAccountProfile;
    stripe?: PrivateAccountStripe;
    createdAt: Date;
    updatedAt: Date;
  };
}

export {};
