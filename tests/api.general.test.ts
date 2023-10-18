import { expect, describe, it } from "bun:test";

const appDomain = process.env.APP_DOMAIN || "http://localhost:3000";

describe("api", () => {
  describe("GET /api/health", async () => {
    const response = await fetch(`${appDomain}/api/health`);

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it('should return "online"', async () => {
      const json = (await response.json()) as Health;
      expect(json.api.status).toEqual("online");
    });
  });

  describe("GET /api/[...]", async () => {
    const response = await fetch(`${appDomain}/api/`);

    it("should return 404", () => {
      expect(response.status).toEqual(404);
    });
  });
});
