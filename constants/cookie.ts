interface CookieSettings {
  path: string;
  maxAge: number;
  sameSite: boolean | "lax" | "strict" | "none";
  secure: boolean;
}

export const cookieSettings: CookieSettings = {
  path: "/",
  maxAge: 60 * 60 * 8,
  sameSite: "lax",
  secure: true,
};
