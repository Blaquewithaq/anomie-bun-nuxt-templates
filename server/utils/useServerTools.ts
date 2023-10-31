import { prisma } from "./useServerDatabase";

/**
 * Checks if the provided email is available in the database.
 *
 * @param email - The email to check availability for.
 * @returns A Promise that resolves to a boolean indicating if the email is available.
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  const result = await prisma.account.findFirst({
    where: {
      email,
    },
  });

  if (result) {
    return false;
  }

  return true;
}

/**
 * Checks if the provided phone number is available in the database.
 *
 * @param phone - The phone number to check availability for.
 * @returns A Promise that resolves to a boolean indicating if the phone number is available.
 */
export async function isPhoneAvailable(phone: string): Promise<boolean> {
  const result = await prisma.account.findFirst({
    where: {
      phone,
    },
  });

  if (result) {
    return false;
  }

  return true;
}

/**
 * Checks if the provided username is available in the database.
 *
 * @param username - The username to check availability for.
 * @returns A Promise that resolves to a boolean indicating if the username is available.
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const result = await prisma.profile.findFirst({
    where: {
      username,
    },
  });

  if (result) {
    return false;
  }

  return true;
}
