import { prisma } from "./useServerDatabase";

/**
 * Creates a new profile with the provided username.
 *
 * @remarks This function is unneeded, as its auto-managed in the database.
 *
 * @param data - An object containing information for creating the profile.
 * @param data.username - The username for the new profile.
 * @returns A Promise that resolves to the created profile or an Error.
 */
export async function createProfileQuery({
  username,
}: {
  username: string;
}): Promise<Profile | Error> {
  try {
    const _result = await prisma.profile.create({
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
  } catch (error) {
    serverConsoleMessage("error", "createProfileQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Updates an existing profile with the provided username.
 *
 * @param id - The ID of the profile to update.
 * @param data - An object containing information for updating the profile.
 * @param data.username - The new username for the profile.
 * @returns A Promise that resolves to the updated profile or an Error.
 */
export async function updateProfileQuery(
  id: string,
  {
    username,
  }: {
    username?: string;
  },
): Promise<Profile | Error> {
  try {
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
  } catch (error) {
    serverConsoleMessage("error", "updateProfileQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Deletes a profile by its ID.
 *
 * @remarks This function is unneeded, as its auto-managed in the database.
 *
 * @param id - The ID of the profile to delete.
 * @returns A Promise that resolves to a success message or an Error.
 */
export async function deleteProfileQuery(id: string): Promise<string | Error> {
  try {
    const _result = await prisma.profile.delete({
      where: {
        id,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    return `Profile deleted: ${_result.id}`;
  } catch (error) {
    serverConsoleMessage("error", "deleteProfileQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves a profile by its ID.
 *
 * @param id - The ID of the profile to retrieve.
 * @returns A Promise that resolves to the profile or an Error.
 */
export async function getProfileQuery(id: string): Promise<Profile | Error> {
  try {
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
  } catch (error) {
    serverConsoleMessage("error", "getProfileQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves all profiles.
 *
 * @returns A Promise that resolves to an array of profiles or an Error.
 */
export async function getProfilesQuery(): Promise<Profile[] | Error> {
  try {
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
  } catch (error) {
    serverConsoleMessage("error", "getProfilesQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}
