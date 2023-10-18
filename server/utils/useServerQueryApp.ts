import { prisma } from "./useServerDatabase";

// Build

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
}): Promise<AppBuild> {
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
}

export async function updateBuildQuery({
  id,
  codename,
  changelog,
  buildDate,
  version,
  targetIds,
}: {
  id: string;
  codename: string;
  changelog: string;
  buildDate: string;
  version: string;
  targetIds?: string[];
}): Promise<AppBuild> {
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
}

export async function deleteBuildQuery({
  id,
}: {
  id: string;
}): Promise<AppBuild> {
  const _result = await prisma.build.delete({
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
}

export async function getBuildQuery({
  id,
}: {
  id: string;
}): Promise<AppBuild | Error> {
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
}

export async function getBuildsQuery(): Promise<AppBuild[] | Error> {
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
}

// Target

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
}): Promise<AppTarget> {
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
}

export async function updateTargetQuery({
  id,
  name,
  description,
  platform,
  buildIds,
}: {
  id: string;
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
}): Promise<AppTarget> {
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
}

export async function deleteTargetQuery({
  id,
}: {
  id: string;
}): Promise<AppTarget> {
  const _result = await prisma.target.delete({
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
}

export async function getTargetQuery({
  id,
}: {
  id: string;
}): Promise<AppTarget | Error> {
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
}

export async function getTargetsQuery(): Promise<AppTarget[] | Error> {
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
}

// Client

export async function createClientQuery({
  browserProperties,
  buildId,
  targetId,
}: {
  browserProperties: string;
  buildId: string;
  targetId: string;
}): Promise<AppClient> {
  const _result = await prisma.client.create({
    data: {
      browserProperties,
      linkClientAndBuild: {
        create: {
          build: {
            connect: {
              id: buildId,
            },
          },
        },
      },
      linkClientAndTarget: {
        create: {
          target: {
            connect: {
              id: targetId,
            },
          },
        },
      },
    },
    include: {
      linkClientAndBuild: {
        include: {
          build: true,
        },
      },
      linkClientAndTarget: {
        include: {
          target: true,
        },
      },
    },
  });

  const result: AppClient = {
    id: _result.id,
    online: _result.online,
    lastOnline: _result.lastOnline,
    disabled: _result.disabled,
    browserProperties: JSON.parse(_result.browserProperties as string),
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
    build: _result.linkClientAndBuild.map((link) => link.build)[0],
    target: _result.linkClientAndTarget.map((link) => link.target)[0],
  };

  return result;
}

export async function updateClientQuery({
  id,
  online,
  lastOnline,
  disabled,
  browserProperties,
  buildId,
  targetId,
}: {
  id: string;
  online?: boolean;
  lastOnline?: string;
  disabled?: boolean;
  browserProperties?: string;
  buildId: string;
  targetId?: string;
}) {
  if (id && buildId) {
    const link = await prisma.linkClientAndBuild.findFirst({
      where: {
        buildId,
        clientId: id,
      },
    });

    if (!link) {
      await prisma.linkClientAndBuild.create({
        data: {
          build: {
            connect: {
              id: buildId,
            },
          },
          client: {
            connect: {
              id,
            },
          },
        },
      });
    }
  }

  if (id && targetId) {
    const link = await prisma.linkClientAndTarget.findFirst({
      where: {
        targetId,
        clientId: id,
      },
    });

    if (!link) {
      await prisma.linkClientAndTarget.create({
        data: {
          target: {
            connect: {
              id: targetId,
            },
          },
          client: {
            connect: {
              id,
            },
          },
        },
      });
    }
  }

  const _result = await prisma.client.update({
    where: {
      id,
    },
    data: {
      online,
      lastOnline,
      disabled,
      browserProperties,
    },
    include: {
      linkClientAndBuild: {
        include: {
          build: true,
        },
      },
      linkClientAndTarget: {
        include: {
          target: true,
        },
      },
    },
  });

  const result: AppClient = {
    id: _result.id,
    online: _result.online,
    lastOnline: _result.lastOnline,
    disabled: _result.disabled,
    browserProperties: JSON.parse(_result.browserProperties as string),
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
    build: _result.linkClientAndBuild.map((link) => link.build)[0],
    target: _result.linkClientAndTarget.map((link) => link.target)[0],
  };

  return result;
}

export async function deleteClientQuery({
  id,
}: {
  id: string;
}): Promise<AppClient> {
  const _result = await prisma.client.delete({
    where: {
      id,
    },
    include: {
      linkClientAndBuild: {
        include: {
          build: true,
        },
      },
      linkClientAndTarget: {
        include: {
          target: true,
        },
      },
    },
  });

  const result: AppClient = {
    id: _result.id,
    online: _result.online,
    lastOnline: _result.lastOnline,
    disabled: _result.disabled,
    browserProperties: JSON.parse(_result.browserProperties as string),
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
    build: _result.linkClientAndBuild.map((link) => link.build)[0],
    target: _result.linkClientAndTarget.map((link) => link.target)[0],
  };

  return result;
}

export async function getClientQuery({
  id,
}: {
  id: string;
}): Promise<AppClient | Error> {
  const _result = await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      linkClientAndBuild: {
        include: {
          build: true,
        },
      },
      linkClientAndTarget: {
        include: {
          target: true,
        },
      },
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

  const result: AppClient = {
    id: _result.id,
    online: _result.online,
    lastOnline: _result.lastOnline,
    disabled: _result.disabled,
    browserProperties: JSON.parse(_result.browserProperties as string),
    createdAt: _result.createdAt,
    updatedAt: _result.updatedAt,
    build: _result.linkClientAndBuild.map((link) => link.build)[0],
    target: _result.linkClientAndTarget.map((link) => link.target)[0],
  };

  return result;
}

export async function getClientsQuery(): Promise<AppClient[] | Error> {
  const _result = await prisma.client.findMany({
    include: {
      linkClientAndBuild: {
        include: {
          build: true,
        },
      },
      linkClientAndTarget: {
        include: {
          target: true,
        },
      },
    },
  });

  if (!_result) return sendErrorCode({ statusCode: 404 });

  const result: AppClient[] = _result.map((client) => ({
    id: client.id,
    online: client.online,
    lastOnline: client.lastOnline,
    disabled: client.disabled,
    browserProperties: JSON.parse(client.browserProperties as string),
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
    build: client.linkClientAndBuild.map((link) => link.build)[0],
    target: client.linkClientAndTarget.map((link) => link.target)[0],
  }));

  return result;
}
