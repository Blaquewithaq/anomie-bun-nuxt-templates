import { prisma } from "./useServerDatabase";

// AccountProfile

// Automatically created when auth user is created
// export async function createAccountProfileQuery() {}

export async function updateAccountProfileQuery({
  id,
  username,
}: {
  id: string;
  username: string;
}): Promise<AccountProfile> {
  const _result = await prisma.accountProfile.update({
    where: {
      id,
    },
    data: {
      username,
    },
  });

  const result: AccountProfile = {
    id: _result.id,
    username: _result.username,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

// Automatically deleted when auth user is deleted
// export async function deleteAccountProfileQuery() {}

export async function getAccountProfileQuery({
  id,
}: {
  id: string;
}): Promise<AccountProfile | Error> {
  const _result = await prisma.accountProfile.findFirst({
    where: {
      id,
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

  const result: AccountProfile = {
    id: _result.id,
    username: _result.username,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

export async function getAccountProfilesQuery(): Promise<AccountProfile[]> {
  const _result = await prisma.accountProfile.findMany({});

  const result: AccountProfile[] = _result.map((user) => {
    const _user: AccountProfile = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return _user;
  });

  return result;
}
