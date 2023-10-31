import { prisma } from "./useServerDatabase";

// Automatically created when auth user is created
// export async function createAccountQuery() {}

export async function updateAccountQuery({
  id,
  role,
  verified,
  banned,
}: {
  id: string;
  role: AccountRole;
  verified: boolean;
  banned: boolean;
}): Promise<Account> {
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
}

// Automatically deleted when auth user is deleted
// export async function deleteAccountQuery() {}

export async function getAccountQuery({
  id,
}: {
  id: string;
}): Promise<Account | Error> {
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
}

export async function getAccountsQuery(): Promise<Account[]> {
  const _result = await prisma.account.findMany({
    include: {
      profile: true,
    },
  });

  const result: Account[] = _result.map((user) => {
    const _user: Account = {
      id: user.id,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
      verified: user.verified,
      banned: user.banned,
      profile: user.profile || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return _user;
  });

  return result;
}
