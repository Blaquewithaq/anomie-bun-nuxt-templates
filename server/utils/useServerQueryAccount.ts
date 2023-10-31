import { prisma } from "./useServerDatabase";

/**
 * Creates a new account with the provided information.
 *
 * @remarks This function is unneeded, as its auto-managed in the database.
 *
 * @param data - An object containing information for creating the account.
 * @param data.email - The email for the new account.
 * @param data.phone - Optional. The phone number for the new account.
 * @param data.role - Optional. The role for the new account.
 * @param data.verified - Optional. Whether the account is verified or not.
 * @param data.banned - Optional. Whether the account is banned or not.
 * @returns A Promise that resolves to the created account or an Error.
 */
export async function createAccountQuery({
  email,
  phone,
  role,
  verified,
  banned,
}: {
  email: string;
  phone?: string;
  role?: AccountRole;
  verified?: boolean;
  banned?: boolean;
}): Promise<Account | Error> {
  try {
    const _result = await prisma.account.create({
      data: {
        email,
        phone,
        role,
        verified,
        banned,
      },
      include: {
        profile: true,
      },
    });

    const result: Account = {
      id: _result.id,
      email: _result.email,
      phone: _result.phone || undefined,
      role: _result.role,
      verified: _result.verified,
      banned: _result.banned,
      profile: _result.profile || undefined,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "createAccountQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Updates an existing account with the provided information.
 *
 * @param id - The ID of the account to update.
 * @param data - An object containing information for updating the account.
 * @param data.role - Optional. The new role for the account.
 * @param data.verified - Optional. Whether the account is now verified or not.
 * @param data.banned - Optional. Whether the account is now banned or not.
 * @returns A Promise that resolves to the updated account or an Error.
 */
export async function updateAccountQuery(
  id: string,
  {
    role,
    verified,
    banned,
  }: {
    role?: AccountRole;
    verified?: boolean;
    banned?: boolean;
  },
): Promise<Account | Error> {
  try {
    const _result = await prisma.account.update({
      where: {
        id,
      },
      data: {
        role,
        verified,
        banned,
      },
      include: {
        profile: true,
      },
    });

    const result: Account = {
      id: _result.id,
      email: _result.email,
      phone: _result.phone || undefined,
      role: _result.role,
      verified: _result.verified,
      banned: _result.banned,
      profile: _result.profile || undefined,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "updateAccountQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Deletes an account by its ID.
 *
 * @remarks This function is unneeded, as its auto-managed in the database.
 *
 * @param id - The ID of the account to delete.
 * @returns A Promise that resolves to a success message or an Error.
 */
export async function deleteAccountQuery(id: string): Promise<string | Error> {
  try {
    const _result = await prisma.account.delete({
      where: {
        id,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    return `Account deleted: ${_result.id}`;
  } catch (error) {
    serverConsoleMessage("error", "deleteAccountQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves an account by its ID.
 *
 * @param id - The ID of the account to retrieve.
 * @returns A Promise that resolves to the account or an Error.
 */
export async function getAccountQuery(id: string): Promise<Account | Error> {
  try {
    const _result = await prisma.account.findFirst({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    const result: Account = {
      id: _result.id,
      email: _result.email,
      phone: _result.phone || undefined,
      role: _result.role,
      verified: _result.verified,
      banned: _result.banned,
      profile: _result.profile || undefined,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getAccountQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves all accounts.
 *
 * @returns A Promise that resolves to an array of accounts or an Error.
 */
export async function getAccountsQuery(): Promise<Account[] | Error> {
  try {
    const _result = await prisma.account.findMany({
      include: {
        profile: true,
      },
    });

    const result: Account[] = _result.map((account) => {
      const _account: Account = {
        id: account.id,
        email: account.email,
        phone: account.phone || undefined,
        role: account.role,
        verified: account.verified,
        banned: account.banned,
        profile: account.profile || undefined,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      };

      return _account;
    });

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getAccountsQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}
