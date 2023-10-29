import { expect, describe, it } from "bun:test";
import {
  apiUrl,
  apiVersion,
  accountId,
  mockAccount,
  mockAccountTwo,
} from "../shared";

// Profile
describe("profile", () => {
  describe(`POST /api/${apiVersion}/profile/:id/update`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/profile/${accountId}/update`,
      {
        method: "POST",
        body: JSON.stringify({
          username: mockAccountTwo.profile?.username,
        }),
      },
    );

    const json = (await response.json()) as AccountProfile;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type AccountProfile", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockAccountProfile", () => {
      expect(json.username).toEqual(mockAccount.profile?.username as string);
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

    it("should match type AccountProfile", async () => {
      const json = (await response.json()) as AccountProfile[];

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

    it("should match type AccountProfile", async () => {
      const json = (await response.json()) as AccountProfile;

      expect(json).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
