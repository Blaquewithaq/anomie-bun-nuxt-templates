import type { H3Error } from "h3";
import { expect, describe, it } from "bun:test";
import { apiUrl } from "../shared";

// General

describe("api", () => {
  describe("GET /api/health", async () => {
    const response = await fetch(`${apiUrl}/health`);

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it('should return "online"', async () => {
      const json = (await response.json()) as Health;
      expect(json.api.status).toEqual("online");
    });
  });

  describe("GET /api/[...]", async () => {
    const response = await fetch(`${apiUrl}/api/`);

    it("should return 404", () => {
      expect(response.status).toEqual(404);
    });

    it("should return error", async () => {
      const json = (await response.json()) as H3Error;
      expect(json.statusMessage).toEqual("Not Found");
    });
  });
});
