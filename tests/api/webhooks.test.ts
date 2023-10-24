import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, accountId, mockAccount } from "../shared";

// Webhooks

describe("api", () => {
  describe("GET /api/v1/webhooks/stripe", async () => {
    const response = await fetch(`${apiUrl}/${apiVersion}/webhooks/stripe`, {
      method: "POST",
    });

    it("should return 204", () => {
      expect(response.status).toEqual(204);
    });
  });

  describe("GET /api/v1/webhooks/stripe/create-customer", async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/webhooks/stripe/create-customer`,
      {
        method: "POST",
        body: JSON.stringify({
          record: {
            id: accountId,
            name: accountId,
            email: mockAccount.email,
          },
        }),
      },
    );

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });
  });

  describe("GET /api/v1/webhooks/stripe/update-customer", async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/webhooks/stripe/update-customer`,
      {
        method: "POST",
        body: JSON.stringify({
          record: {
            id: accountId,
            name: "newName",
            email: "newName@thisisanothertest.com",
          },
        }),
      },
    );

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });
  });

  describe("GET /api/v1/webhooks/stripe/delete-customer", async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/webhooks/stripe/delete-customer`,
      {
        method: "POST",
        body: JSON.stringify({
          record: {
            id: accountId,
          },
        }),
      },
    );

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });
  });
});
