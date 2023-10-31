// Mock Data
export const buildMock = {
  codename: "testBuild",
  changelog: "test-changelog",
  buildDate: new Date().toISOString(),
  version: "0.0.0",
};

export const targetMock = {
  name: "web-browser",
  description: "Target: Web Browser",
  platform: "web",
};

export const clientMock = {
  online: true,
  lastOnline: new Date().toISOString(),
  disabled: false,
  data: {
    browserPropertiesAllowCollect: true,
    browserProperties: JSON.stringify({
      userAgent:
        "Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Mobile Safari/537.36",
      platform: "Linux armv8l",
      vendor: "Google Inc.",
      languages: ["en-US", "en"],
      hardwareConcurrency: 8,
      deviceMemory: 4,
      screen: {
        width: 1920,
        height: 1080,
        pixelRatio: 1,
      },
      window: {
        width: 1920,
        height: 1080,
      },
    }),
  },
};

export const accountMock = {
  email: "test@test.com",
  phone: "1234567890",
  username: "test",
  role: "tester",
  verified: true,
  banned: true,
};
