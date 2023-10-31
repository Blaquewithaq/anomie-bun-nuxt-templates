import { prisma } from "./useServerDatabase";

/**
 * Creates a new target with the provided information.
 *
 * @param data - An object containing information for creating the target.
 * @param data.name - The name of the new target.
 * @param data.description - The description of the new target.
 * @param data.platform - The platform of the new target.
 * @param data.buildIds - Optional. An array of build IDs associated with the target.
 * @returns A Promise that resolves to the created target or an Error.
 */
export async function createTargetQuery({
  name,
  description,
  platform,
  buildIds,
}: {
  name: string;
  description: string;
  platform: "windows" | "macos" | "linux" | "android" | "ios" | "web" | "other";
  buildIds?: string[];
}): Promise<AppTarget | Error> {
  try {
    let _result = await prisma.target.findFirst({
      where: {
        name,
      },
      include: {
        linkBuildAndTarget: {
          include: {
            build: true,
          },
        },
      },
    });

    if (!_result) {
      _result = await prisma.target.create({
        data: {
          name,
          description,
          platform,
        },
        include: {
          linkBuildAndTarget: {
            include: {
              build: true,
            },
          },
        },
      });

      if (_result.id && buildIds) {
        const targetId = _result.id;

        _result = await prisma.target.update({
          where: {
            id: _result.id,
          },
          data: {
            linkBuildAndTarget: {
              create: buildIds.map((id) => ({
                targetId,
                buildId: id,
              })),
            },
          },
          include: {
            linkBuildAndTarget: {
              include: {
                build: true,
              },
            },
          },
        });
      }
    }

    const result: AppTarget = {
      id: _result.id,
      name: _result.name,
      description: _result.description,
      platform: _result.platform,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      builds: _result.linkBuildAndTarget.map((link) => link.build),
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "createTargetQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Updates an existing target with the provided information.
 *
 * @param id - The ID of the target to update.
 * @param data - An object containing information for updating the target.
 * @param data.name - The new name for the target.
 * @param data.description - The new description for the target.
 * @param data.platform - The new platform for the target.
 * @param data.buildIds - Optional. An array of build IDs associated with the target.
 * @returns A Promise that resolves to the updated target or an Error.
 */
export async function updateTargetQuery(
  id: string,
  {
    name,
    description,
    platform,
    buildIds,
  }: {
    name?: string;
    description?: string;
    platform?:
      | "windows"
      | "macos"
      | "linux"
      | "android"
      | "ios"
      | "web"
      | "other";
    buildIds?: string[];
  },
): Promise<AppTarget | Error> {
  try {
    let _result = await prisma.target.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        platform,
      },
      include: {
        linkBuildAndTarget: {
          include: {
            build: true,
          },
        },
      },
    });

    if (_result.id && buildIds) {
      const targetId = _result.id;

      _result = await prisma.target.update({
        where: {
          id: _result.id,
        },
        data: {
          linkBuildAndTarget: {
            create: buildIds.map((id) => ({
              targetId,
              buildId: id,
            })),
          },
        },
        include: {
          linkBuildAndTarget: {
            include: {
              build: true,
            },
          },
        },
      });
    }

    const result: AppTarget = {
      id: _result.id,
      name: _result.name,
      description: _result.description,
      platform: _result.platform,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      builds: _result.linkBuildAndTarget.map((link) => link.build),
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "updateTargetQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Deletes a target by its ID.
 *
 * @param id - The ID of the target to delete.
 * @returns A Promise that resolves to a success message or an Error.
 */
export async function deleteTargetQuery(id: string): Promise<string | Error> {
  try {
    const _result = await prisma.target.delete({
      where: {
        id,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    return `Target deleted: ${_result.id}`;
  } catch (error) {
    serverConsoleMessage("error", "deleteTargetQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves a target by its ID.
 *
 * @param id - The ID of the target to retrieve.
 * @returns A Promise that resolves to the target or an Error.
 */
export async function getTargetQuery(id: string): Promise<AppTarget | Error> {
  try {
    const _result = await prisma.target.findUnique({
      where: {
        id,
      },
      include: {
        linkBuildAndTarget: {
          include: {
            build: true,
          },
        },
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    const result: AppTarget = {
      id: _result.id,
      name: _result.name,
      description: _result.description,
      platform: _result.platform,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      builds: _result.linkBuildAndTarget.map((link) => link.build),
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getTargetQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves all targets.
 *
 * @returns A Promise that resolves to an array of targets or an Error.
 */
export async function getTargetsQuery(): Promise<AppTarget[] | Error> {
  try {
    const _result = await prisma.target.findMany({
      include: {
        linkBuildAndTarget: {
          include: {
            build: true,
          },
        },
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    const result: AppTarget[] = _result.map((target) => ({
      id: target.id,
      name: target.name,
      description: target.description,
      platform: target.platform,
      createdAt: target.createdAt,
      updatedAt: target.updatedAt,
      builds: target.linkBuildAndTarget.map((link) => link.build),
    }));

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getTargetsQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}
