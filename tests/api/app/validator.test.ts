import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion } from "~/tests/shared";
import { accountMock } from "~/tests/shared/mock";
import { useAuthHeader } from "~/tests/shared/helpers";

describe("api", () => {
  describe("app", () => {
    describe("validator", () => {
      describe(`POST /api/${apiVersion}/app/validator/is-email-available`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/validator/is-email-available`,
          {
            method: "POST",
            body: JSON.stringify({ email: accountMock.email }),
            headers: useAuthHeader(),
          },
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return false (unavailable)", async () => {
          const json = await response.json();
          expect(json).toEqual(false);
        });

        it("should return true (available)", async () => {
          const response = await fetch(
            `${apiUrl}/${apiVersion}/app/validator/is-email-available`,
            {
              method: "POST",
              body: JSON.stringify({ email: "test2@test.com" }),
              headers: useAuthHeader(),
            },
          );

          const json = await response.json();
          expect(json).toEqual(true);
        });
      });

      describe(`POST /api/${apiVersion}/app/validator/is-phone-available`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/validator/is-phone-available`,
          {
            method: "POST",
            body: JSON.stringify({ phone: accountMock.phone }),
            headers: useAuthHeader(),
          },
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return false (unavailable)", async () => {
          const json = await response.json();
          expect(json).toEqual(false);
        });

        it("should return true (available)", async () => {
          const response = await fetch(
            `${apiUrl}/${apiVersion}/app/validator/is-phone-available`,
            {
              method: "POST",
              body: JSON.stringify({ phone: "0987654321" }),
              headers: useAuthHeader(),
            },
          );
          const json = await response.json();
          expect(json).toEqual(true);
        });
      });

      describe(`POST /api/${apiVersion}/app/validator/is-username-available`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/validator/is-username-available`,
          {
            method: "POST",
            body: JSON.stringify({ username: accountMock.username }),
            headers: useAuthHeader(),
          },
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return false (unavailable)", async () => {
          const json = await response.json();
          expect(json).toEqual(false);
        });

        it("should return true (available)", async () => {
          const response = await fetch(
            `${apiUrl}/${apiVersion}/app/validator/is-username-available`,
            {
              method: "POST",
              body: JSON.stringify({ username: "test2" }),
              headers: useAuthHeader(),
            },
          );
          const json = await response.json();
          expect(json).toEqual(true);
        });
      });
    });
  });
});
