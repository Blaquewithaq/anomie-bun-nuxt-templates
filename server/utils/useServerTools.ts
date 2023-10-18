import { prisma } from "./useServerDatabase";

export async function isEmailAvailable(email: string): Promise<boolean> {
  const result = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (result) {
    return false;
  }

  return true;
}

export async function isPhoneAvailable(phone: string): Promise<boolean> {
  const result = await prisma.user.findFirst({
    where: {
      phone,
    },
  });

  if (result) {
    return false;
  }

  return true;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const result = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (result) {
    return false;
  }

  return true;
}
