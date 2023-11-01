import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, accountId } from "~/tests/shared";
import { accountMock } from "~/tests/shared/mock";
import { useAuthHeader } from "~/tests/shared/helpers";

describe("api", () => {
  describe("account", () => {
    describe("profile", () => {
      describe(`POST /api/${apiVersion}/account/:id/profile/update`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/account/${accountId}/profile/update`,
          {
            method: "POST",
            body: JSON.stringify({
              username: accountMock.username,
            }),
            headers: useAuthHeader(),
          },
        );

        const json = (await response.json()) as Profile;

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type Profile", () => {
          expect(json).toMatchObject({
            id: expect.any(String),
            username: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });

        it("should match accountMock", () => {
          expect(json.username).toEqual(accountMock.username);
        });
      });

      describe(`GET /api/${apiVersion}/account/:id/profile`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/account/${accountId}/profile`,
          {
            headers: useAuthHeader(),
          },
        );

        const json = (await response.json()) as Profile;

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type Profile", () => {
          expect(json).toMatchObject({
            id: expect.any(String),
            username: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });

        it("should match accountMock", () => {
          expect(json.username).toEqual(accountMock.username + "updated");
        });
      });
    });
  });
});
