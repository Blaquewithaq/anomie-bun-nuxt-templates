declare global {
  type AppBuild = {
    id: string;
    codename: string;
    changelog: string;
    buildDate: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
    targets?: AppTarget[];
  };

  type AppTargetPlatform = "windows" | "macos" | "linux" | "android" | "ios" | "web" | "other";

  type AppTarget = {
    id: string;
    name: string;
    description: string;
    platform: AppTargetPlatform;
    createdAt: Date;
    updatedAt: Date;
    builds?: AppBuild[];
  };

  type AppClientData = {
    id?: string;
    browserPropertiesAllowCollect?: boolean;
    browserProperties?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  };

  type AppClient = {
    id: string;
    online: boolean;
    lastOnline: Date;
    disabled: boolean;
    data?: AppClientData | null;
    createdAt: Date;
    updatedAt: Date;
    build?: AppBuild;
    target?: AppTarget;
  };
}

export { };
