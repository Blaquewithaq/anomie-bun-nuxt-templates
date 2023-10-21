import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, userId, mockUser } from "../shared";

// User
describe("user", () => {
  describe(`POST /api/${apiVersion}/user/:id/update`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/user/${userId}/update`,
      {
        method: "POST",
        body: JSON.stringify({
          role: mockUser.role,
          verified: mockUser.verified,
          banned: mockUser.banned,
        }),
      },
    );

    const json = (await response.json()) as PublicUser;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type PublicUser", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        role: expect.any(String),
        verified: expect.any(Boolean),
        banned: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockUser", () => {
      expect(json.role).toEqual(mockUser.role as PublicUserRole);
      expect(json.verified).toEqual(mockUser.verified);
      expect(json.banned).toEqual(mockUser.banned);
    });
  });
});
