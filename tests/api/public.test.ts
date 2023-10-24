import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, accountId, mockAccount } from "../shared";

// Profile
describe("profile", () => {
  describe(`POST /api/${apiVersion}/profile/:id/update`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/profile/${accountId}/update`,
      {
        method: "POST",
        body: JSON.stringify({
          username: "updatedUsernameRawr",
        }),
      },
    );

    const json = (await response.json()) as PublicAccountProfile;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type PublicAccountProfile", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockAccountProfile", () => {
      expect(json.username).toEqual(mockAccount.username);
    });
  });

  describe(`GET /api/${apiVersion}/profile`, async () => {
    const response = await fetch(`${apiUrl}/${apiVersion}/profile`);

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type PublicAccountProfile", async () => {
      const json = (await response.json()) as PublicAccountProfile[];

      json.forEach((item) => {
        expect(item).toMatchObject({
          id: expect.any(String),
          username: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });
  });

  describe(`GET /api/${apiVersion}/profile/:id`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/profile/${accountId}`,
    );

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type PublicAccountProfile", async () => {
      const json = (await response.json()) as PublicAccountProfile;

      expect(json).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
