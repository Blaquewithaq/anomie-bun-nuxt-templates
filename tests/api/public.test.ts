import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, accountId, mockUser } from "../shared";

// Account
describe("account", () => {
  describe(`POST /api/${apiVersion}/account/:id/update`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/account/${accountId}/update`,
      {
        method: "POST",
        body: JSON.stringify({
          role: mockUser.role,
          verified: mockUser.verified,
          banned: mockUser.banned,
        }),
      },
    );

    const json = (await response.json()) as PrivateAccount;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type PrivateAccount", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        role: expect.any(String),
        verified: expect.any(Boolean),
        banned: expect.any(Boolean),
        profile: expect.any(Object),
        stripe: expect.any(Object),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockUser", () => {
      expect(json.role).toEqual(mockUser.role as PrivateAccountRole);
      expect(json.verified).toEqual(mockUser.verified);
      expect(json.banned).toEqual(mockUser.banned);
    });
  });
});
