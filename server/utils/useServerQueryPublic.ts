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
}): Promise<Profile> {
  const _result = await prisma.profile.update({
    where: {
      id,
    },
    data: {
      username,
    },
  });

  const result: Profile = {
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
}): Promise<Profile | Error> {
  const _result = await prisma.profile.findFirst({
    where: {
      id,
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

  const result: Profile = {
    id: _result.id,
    username: _result.username,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

export async function getAccountProfilesQuery(): Promise<Profile[]> {
  const _result = await prisma.profile.findMany({});

  const result: Profile[] = _result.map((user) => {
    const _user: Profile = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return _user;
  });

  return result;
}
