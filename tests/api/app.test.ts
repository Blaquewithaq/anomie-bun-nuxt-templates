import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion } from "../shared";

// App

describe("api", () => {
  describe(`GET /api/${apiVersion}/app/build`, async () => {
    const response = await fetch(`${apiUrl}/${apiVersion}/app/build`);

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });
  });
});
