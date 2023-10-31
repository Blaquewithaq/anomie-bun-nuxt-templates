import { prisma } from "./useServerDatabase";

/**
 * Creates a new build with the provided information.
 *
 * @param data - An object containing information for creating the build.
 * @param data.codename - The codename for the new build.
 * @param data.changelog - The changelog for the new build.
 * @param data.buildDate - The build date for the new build.
 * @param data.version - The version for the new build.
 * @param data.targetIds - Optional. An array of target IDs for the new build.
 * @returns A Promise that resolves to the created build or an Error.
 */
export async function createBuildQuery({
  codename,
  changelog,
  buildDate,
  version,
  targetIds,
}: {
  codename: string;
  changelog: string;
  buildDate: string;
  version: string;
  targetIds?: string[];
}): Promise<AppBuild | Error> {
  try {
    let _result = await prisma.build.findFirst({
      where: {
        OR: [
          {
            codename,
          },
          {
            version,
          },
        ],
      },
      include: {
        linkBuildAndTarget: {
          include: {
            target: true,
          },
        },
      },
    });

    if (!_result) {
      _result = await prisma.build.create({
        data: {
          codename,
          changelog,
          buildDate,
          version,
        },
        include: {
          linkBuildAndTarget: {
            include: {
              target: true,
            },
          },
        },
      });

      if (_result.id && targetIds) {
        const buildId = _result.id;

        _result = await prisma.build.update({
          where: {
            id: _result.id,
          },
          data: {
            linkBuildAndTarget: {
              create: targetIds.map((id) => ({
                buildId,
                targetId: id,
              })),
            },
          },
          include: {
            linkBuildAndTarget: {
              include: {
                target: true,
              },
            },
          },
        });
      }
    }

    const result: AppBuild = {
      id: _result.id,
      codename: _result.codename,
      changelog: _result.changelog,
      buildDate: _result.buildDate,
      version: _result.version,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      targets: _result.linkBuildAndTarget.map((link) => link.target),
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "createBuildQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Updates an existing build with the provided information.
 *
 * @param id - The ID of the build to update.
 * @param data - An object containing information for updating the build.
 * @param data.codename - The new codename for the build.
 * @param data.changelog - The new changelog for the build.
 * @param data.buildDate - The new build date for the build.
 * @param data.version - The new version for the build.
 * @param data.targetIds - Optional. An array of target IDs for the build.
 * @returns A Promise that resolves to the updated build or an Error.
 */
export async function updateBuildQuery(
  id: string,
  {
    codename,
    changelog,
    buildDate,
    version,
    targetIds,
  }: {
    codename?: string;
    changelog?: string;
    buildDate?: string;
    version?: string;
    targetIds?: string[];
  },
): Promise<AppBuild | Error> {
  try {
    let _result = await prisma.build.update({
      where: {
        id,
      },
      data: {
        codename,
        changelog,
        buildDate,
        version,
      },
      include: {
        linkBuildAndTarget: {
          include: {
            target: true,
          },
        },
      },
    });

    if (_result.id && targetIds) {
      const buildId = _result.id;

      _result = await prisma.build.update({
        where: {
          id: _result.id,
        },
        data: {
          linkBuildAndTarget: {
            create: targetIds.map((id) => ({
              buildId,
              targetId: id,
            })),
          },
        },
        include: {
          linkBuildAndTarget: {
            include: {
              target: true,
            },
          },
        },
      });
    }

    const result: AppBuild = {
      id: _result.id,
      codename: _result.codename,
      changelog: _result.changelog,
      buildDate: _result.buildDate,
      version: _result.version,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      targets: _result.linkBuildAndTarget.map((link) => link.target),
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "updateBuildQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Deletes a build by its ID.
 *
 * @param id - The ID of the build to delete.
 * @returns A Promise that resolves to a success message or an Error.
 */
export async function deleteBuildQuery(id: string): Promise<string | Error> {
  try {
    const _result = await prisma.build.delete({
      where: {
        id,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    return `Build deleted: ${_result.id}`;
  } catch (error) {
    serverConsoleMessage("error", "deleteBuildQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves a build by its ID.
 *
 * @param id - The ID of the build to retrieve.
 * @returns A Promise that resolves to the build or an Error.
 */
export async function getBuildQuery(id: string): Promise<AppBuild | Error> {
  try {
    const _result = await prisma.build.findUnique({
      where: {
        id,
      },
      include: {
        linkBuildAndTarget: {
          include: {
            target: true,
          },
        },
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    const result: AppBuild = {
      id: _result.id,
      codename: _result.codename,
      changelog: _result.changelog,
      buildDate: _result.buildDate,
      version: _result.version,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      targets: _result.linkBuildAndTarget.map((link) => link.target),
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getBuildQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves all builds.
 *
 * @returns A Promise that resolves to an array of builds or an Error.
 */
export async function getBuildsQuery(): Promise<AppBuild[] | Error> {
  try {
    const _result = await prisma.build.findMany({
      include: {
        linkBuildAndTarget: {
          include: {
            target: true,
          },
        },
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    const result: AppBuild[] = _result.map((build) => ({
      id: build.id,
      codename: build.codename,
      changelog: build.changelog,
      buildDate: build.buildDate,
      version: build.version,
      createdAt: build.createdAt,
      updatedAt: build.updatedAt,
      targets: build.linkBuildAndTarget.map((link) => link.target),
    }));

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getBuildsQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}
