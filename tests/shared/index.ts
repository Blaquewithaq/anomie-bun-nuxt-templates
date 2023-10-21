//  General
export const appDomain = process.env.APP_DOMAIN || "http://localhost:3000";
export const apiUrl = `${appDomain}/api`;
export const apiVersion = "v1";

// Auth
export const buildId = "af1e214e-6491-4b1b-b88f-0073278fa3fb";
export const targetId = "8291d6d5-6aea-41a8-91f9-b227f4163799";
export const clientId = "d2f5c1c2-0c2d-4d5d-9a1b-1d4f5d2c0c2d";
export const userId = "b7a8a3b0-1f7e-4f1f-8e1c-0f4b9e3d6f8c";

// Mock Data
export const mockBuild = {
  codename: "test",
  changelog: "test-changelog",
  buildDate: "2020-01-01",
  version: "1.0.0",
};

export const mockTarget = {
  name: "test-name",
  description: "test-description",
  platform: "other",
};

export const mockClient = {
  online: true,
  lastOnline: new Date(),
  disabled: false,
  browserProperties: JSON.stringify({}),
};

export const mockUser = {
  email: "test@test.com",
  phone: "1234567890",
  username: "test",
  role: "tester",
  verified: true,
  banned: true,
};
