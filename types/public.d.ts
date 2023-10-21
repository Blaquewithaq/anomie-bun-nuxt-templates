declare global {
  type PublicUserRole = "admin" | "user" | "beta" | "tester";
  type PublicUser = {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: PublicUserRole;
    verified: boolean;
    banned: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export {};
