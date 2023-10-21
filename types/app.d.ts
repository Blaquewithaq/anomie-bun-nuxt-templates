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

  type AppTarget = {
    id: string;
    name: string;
    description: string;
    platform:
      | "windows"
      | "macos"
      | "linux"
      | "android"
      | "ios"
      | "web"
      | "other";
    createdAt: Date;
    updatedAt: Date;
    builds?: AppBuild[];
  };

  type AppClient = {
    id: string;
    online: boolean;
    lastOnline: Date;
    disabled: boolean;
    browserProperties: string;
    createdAt: Date;
    updatedAt: Date;
    build?: AppBuild;
    target?: AppTarget;
  };
}

export {};
