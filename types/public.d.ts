declare global {
  type PublicUser = {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: "admin" | "user" | "beta" | "tester";
    verified: boolean;
    banned: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export {};
