import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, accountId } from "~/tests/shared";
import { accountMock } from "~/tests/shared/mock";

describe("api", () => {
  describe("account", () => {
    describe(`POST /api/${apiVersion}/account/:id/update`, async () => {
      const response = await fetch(
        `${apiUrl}/${apiVersion}/account/${accountId}/update`,
        {
          method: "POST",
          body: JSON.stringify({
            role: accountMock.role,
            verified: accountMock.verified,
            banned: accountMock.banned,
          }),
        },
      );

      const json = (await response.json()) as Account;

      it("should return 200", () => {
        expect(response.status).toEqual(200);
      });

      it("should return a JSON object", () => {
        expect(response.headers.get("content-type")).toContain(
          "application/json",
        );
      });

      it("should match type Account", () => {
        expect(json).toMatchObject({
          id: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          role: expect.any(String),
          verified: expect.any(Boolean),
          banned: expect.any(Boolean),
          profile: expect.any(Object),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should match accountMock", () => {
        expect(json.role).toEqual(accountMock.role as AccountRole);
        expect(json.verified).toEqual(accountMock.verified);
        expect(json.banned).toEqual(accountMock.banned);
      });
    });
  });
});
