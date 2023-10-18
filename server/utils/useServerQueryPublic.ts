import { prisma } from "./useServerDatabase";

// User

// Automatically created when auth user is created
// export async function createUserQuery() {}

export async function updateUserQuery({
  id,
  role,
  verified,
  banned,
}: {
  id: string;
  role: "admin" | "user" | "beta" | "tester";
  verified: boolean;
  banned: boolean;
}): Promise<PublicUser> {
  const _result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
      verified,
      banned,
    },
  });

  const result: PublicUser = {
    id: _result.id,
    username: _result.username,
    email: _result.email,
    phone: _result.phone || "",
    role: _result.role,
    verified: _result.verified,
    banned: _result.banned,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

// Automatically deleted when auth user is deleted
// export async function deleteUserQuery() {}

export async function getUserQuery({
  id,
}: {
  id: string;
}): Promise<PublicUser | Error> {
  const _result = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

  const result: PublicUser = {
    id: _result.id,
    username: _result.username,
    email: _result.email,
    phone: _result.phone || "",
    role: _result.role,
    verified: _result.verified,
    banned: _result.banned,
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
  };

  return result;
}

export async function getUsersQuery(): Promise<PublicUser[]> {
  const _result = await prisma.user.findMany({});

  const result: PublicUser[] = _result.map((user) => {
    const _user: PublicUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      verified: user.verified,
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return _user;
  });

  return result;
}
