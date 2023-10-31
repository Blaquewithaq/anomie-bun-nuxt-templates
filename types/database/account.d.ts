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
}

export {};
