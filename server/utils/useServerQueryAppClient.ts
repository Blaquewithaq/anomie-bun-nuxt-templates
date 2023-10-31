import { prisma } from "./useServerDatabase";

/**
 * Creates a new client with the provided information.
 *
 * @param data - An object containing information for creating the client.
 * @param data.online - Optional. Indicates if the client is online.
 * @param data.lastOnline - Optional. The date and time of the client's last online status.
 * @param data.disabled - Optional. Indicates if the client is disabled.
 * @param data.data - Optional. Additional data associated with the client.
 * @param data.buildId - The ID of the associated build.
 * @param data.targetId - The ID of the associated target.
 * @returns A Promise that resolves to the created client or an Error.
 */
export async function createClientQuery({
  online,
  lastOnline,
  disabled,
  data,
  buildId,
  targetId,
}: {
  online?: boolean;
  lastOnline?: string;
  disabled?: boolean;
  data?: AppClientData;
  buildId: string;
  targetId: string;
}): Promise<AppClient | Error> {
  try {
    const _result = await prisma.client.create({
      data: {
        online,
        lastOnline,
        disabled,
        buildId,
        targetId,
        data: data
          ? {
              create: {
                browserPropertiesAllowCollect:
                  data.browserPropertiesAllowCollect,
                browserProperties: data.browserProperties
                  ? JSON.parse(data.browserProperties)
                  : undefined,
              },
            }
          : undefined,
      },
      include: {
        data: true,
        build: true,
        target: true,
      },
    });

    const result: AppClient = {
      id: _result.id,
      online: _result.online,
      lastOnline: _result.lastOnline,
      disabled: _result.disabled,
      data: _result.data
        ? {
            id: _result.data.id,
            browserPropertiesAllowCollect:
              _result.data.browserPropertiesAllowCollect,
            browserProperties: JSON.stringify(_result.data.browserProperties),
            createdAt: _result.data.createdAt,
            updatedAt: _result.data.updatedAt,
          }
        : undefined,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      build: _result.build,
      target: _result.target,
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "createClientQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Updates an existing client with the provided information.
 *
 * @param id - The ID of the client to update.
 * @param data - An object containing information for updating the client.
 * @param data.online - Optional. Indicates if the client is online.
 * @param data.lastOnline - Optional. The date and time of the client's last online status.
 * @param data.disabled - Optional. Indicates if the client is disabled.
 * @param data.data - Optional. Additional data associated with the client.
 * @param data.buildId - Optional. The ID of the associated build.
 * @param data.targetId - Optional. The ID of the associated target.
 * @returns A Promise that resolves to the updated client or an Error.
 */
export async function updateClientQuery(
  id: string,
  {
    online,
    lastOnline,
    disabled,
    data,
    buildId,
    targetId,
  }: {
    online?: boolean;
    lastOnline?: string;
    disabled?: boolean;
    data?: AppClientData;
    buildId?: string;
    targetId?: string;
  },
): Promise<AppClient | Error> {
  try {
    const _result = await prisma.client.update({
      where: {
        id,
      },
      data: {
        online,
        lastOnline,
        disabled,
        buildId,
        targetId,
        data: data
          ? {
              update: {
                browserPropertiesAllowCollect:
                  data.browserPropertiesAllowCollect,
                browserProperties: data.browserProperties
                  ? JSON.parse(data.browserProperties)
                  : undefined,
              },
            }
          : undefined,
      },
      include: {
        data: true,
        build: true,
        target: true,
      },
    });

    const result: AppClient = {
      id: _result.id,
      online: _result.online,
      lastOnline: _result.lastOnline,
      disabled: _result.disabled,
      data: _result.data
        ? {
            id: _result.data.id,
            browserPropertiesAllowCollect:
              _result.data.browserPropertiesAllowCollect,
            browserProperties: JSON.stringify(_result.data.browserProperties),
            createdAt: _result.data.createdAt,
            updatedAt: _result.data.updatedAt,
          }
        : undefined,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      build: _result.build,
      target: _result.target,
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "updateClientQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Deletes a client by its ID.
 *
 * @param id - The ID of the client to delete.
 * @returns A Promise that resolves to a success message or an Error.
 */
export async function deleteClientQuery(id: string): Promise<string | Error> {
  try {
    const _result = await prisma.client.delete({
      where: {
        id,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    return `Client deleted: ${_result.id}`;
  } catch (error) {
    serverConsoleMessage("error", "deleteClientQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves a client by its ID.
 *
 * @param id - The ID of the client to retrieve.
 * @returns A Promise that resolves to the client or an Error.
 */
export async function getClientQuery(id: string): Promise<AppClient | Error> {
  try {
    const _result = await prisma.client.findUnique({
      where: {
        id,
      },
      include: {
        data: true,
        build: true,
        target: true,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    const result: AppClient = {
      id: _result.id,
      online: _result.online,
      lastOnline: _result.lastOnline,
      disabled: _result.disabled,
      data: _result.data
        ? {
            id: _result.data.id,
            browserPropertiesAllowCollect:
              _result.data.browserPropertiesAllowCollect,
            browserProperties: JSON.stringify(_result.data.browserProperties),
            createdAt: _result.data.createdAt,
            updatedAt: _result.data.updatedAt,
          }
        : undefined,
      createdAt: _result.createdAt,
      updatedAt: _result.updatedAt,
      build: _result.build,
      target: _result.target,
    };

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getClientQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}

/**
 * Retrieves all clients.
 *
 * @returns A Promise that resolves to an array of clients or an Error.
 */
export async function getClientsQuery(): Promise<AppClient[] | Error> {
  try {
    const _result = await prisma.client.findMany({
      include: {
        data: true,
        build: true,
        target: true,
      },
    });

    if (!_result) return sendErrorCode({ statusCode: 404 });

    const result: AppClient[] = _result.map((client) => ({
      id: client.id,
      online: client.online,
      lastOnline: client.lastOnline,
      disabled: client.disabled,
      data: client.data
        ? {
            id: client.data.id,
            browserPropertiesAllowCollect:
              client.data.browserPropertiesAllowCollect,
            browserProperties: JSON.stringify(client.data.browserProperties),
            createdAt: client.data.createdAt,
            updatedAt: client.data.updatedAt,
          }
        : undefined,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      build: client.build,
      target: client.target,
    }));

    return result;
  } catch (error) {
    serverConsoleMessage("error", "getClientsQuery:", error);
    return sendErrorCode({ statusCode: 500 });
  }
}
