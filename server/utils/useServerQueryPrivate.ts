import { prisma } from "./useServerDatabase";

// Account

// Automatically created when auth user is created
// export async function createAccountQuery() {}

export async function updateAccountQuery({
  id,
  role,
  verified,
  banned,
}: {
  id: string;
  role: PrivateAccountRole;
  verified: boolean;
  banned: boolean;
}): Promise<PrivateAccount> {
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
      stripe: true,
    },
  });

  const result: PrivateAccount = {
    id: _result.id,
    email: _result.email,
    phone: _result.phone || "",
    role: _result.role,
    verified: _result.verified,
    banned: _result.banned,
    profile: _result.profile || undefined,
    stripe: _result.stripe || undefined,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

// Automatically deleted when auth user is deleted
// export async function deleteAccountQuery() {}

export async function getAccountQuery({
  id,
}: {
  id: string;
}): Promise<PrivateAccount | Error> {
  const _result = await prisma.account.findFirst({
    where: {
      id,
    },
    include: {
      profile: true,
      stripe: true,
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

  const result: PrivateAccount = {
    id: _result.id,
    email: _result.email,
    phone: _result.phone || "",
    role: _result.role,
    verified: _result.verified,
    banned: _result.banned,
    profile: _result.profile || undefined,
    stripe: _result.stripe || undefined,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

export async function getAccountsQuery(): Promise<PrivateAccount[]> {
  const _result = await prisma.account.findMany({
    include: {
      profile: true,
      stripe: true,
    },
  });

  const result: PrivateAccount[] = _result.map((user) => {
    const _user: PrivateAccount = {
      id: user.id,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      verified: user.verified,
      banned: user.banned,
      profile: user.profile || undefined,
      stripe: user.stripe || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return _user;
  });

  return result;
}
