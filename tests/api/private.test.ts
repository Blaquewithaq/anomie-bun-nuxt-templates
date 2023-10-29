import { expect, describe, it } from "bun:test";
import {
  apiUrl,
  apiVersion,
  accountId,
  mockAccount,
  mockAccountTwo,
} from "../shared";

// Account
describe("account", () => {
  describe(`POST /api/${apiVersion}/account/:id/update`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/account/${accountId}/update`,
      {
        method: "POST",
        body: JSON.stringify({
          role: mockAccount.role,
          verified: mockAccount.verified,
          banned: mockAccount.banned,
          billing: mockAccountTwo.billing,
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
        billing: expect.any(Object),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockAccount", () => {
      expect(json.role).toEqual(mockAccount.role as AccountRole);
      expect(json.verified).toEqual(mockAccount.verified as boolean);
      expect(json.banned).toEqual(mockAccount.banned as boolean);
    });
  });
});

// Product
describe("product", () => {
  describe(`POST /api/${apiVersion}/product/create`, async () => {
    const response = await fetch(`${apiUrl}/${apiVersion}/product/create`, {
      method: "POST",
      body: JSON.stringify({
        name: "Test Product",
        description: "Test Description",
        active: true,
        features: ["Test Feature"],
        imageUrls: [],
        price: "2.99",
        currency: "usd",
        recurringInterval: "month",
        recurringCount: 1,
      }),
    });

    const json = (await response.json()) as Product;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type Product", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        stripeProductId: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        active: expect.any(Boolean),
        features: expect.any(Array),
        imageUrls: expect.any(Array),
        price: expect.any(String),
        currency: expect.any(String),
        recurringInterval: expect.any(String),
        recurringCount: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockProduct", () => {
      expect(json.name).toEqual("Test Product");
      expect(json.description).toEqual("Test Description");
      expect(json.active).toEqual(true);
      expect(json.features).toEqual(["Test Feature"]);
      expect(json.imageUrls).toEqual(["Test Image URL"]);
      expect(json.price).toEqual("2.99");
      expect(json.currency).toEqual("usd");
      expect(json.recurringInterval).toEqual("month");
      expect(json.recurringCount).toEqual(1);
    });
  });

  describe(`POST /api/${apiVersion}/product/:id/update`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/product/5415b2f9-9ccd-41bb-bb5a-39d66a895d77/update`,
      {
        method: "POST",
        body: JSON.stringify({
          name: "Test Product2",
          description: "Test Description2",
          active: true,
          features: ["Test Feature2"],
          imageUrls: [],
        }),
      },
    );

    const json = (await response.json()) as Product;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type Product", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        stripeProductId: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        active: expect.any(Boolean),
        features: expect.any(Array),
        imageUrls: expect.any(Array),
        price: expect.any(String),
        currency: expect.any(String),
        recurringInterval: expect.any(String),
        recurringCount: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockProduct", () => {
      expect(json.name).toEqual("Test Product");
      expect(json.description).toEqual("Test Description");
      expect(json.active).toEqual(true);
      expect(json.features).toEqual(["Test Feature"]);
      expect(json.imageUrls).toEqual(["Test Image URL"]);
      expect(json.price).toEqual("2.99");
      expect(json.currency).toEqual("usd");
      expect(json.recurringInterval).toEqual("month");
      expect(json.recurringCount).toEqual(1);
    });
  });

  describe(`GET /api/${apiVersion}/product`, async () => {
    const response = await fetch(`${apiUrl}/${apiVersion}/product`);

    const json = (await response.json()) as Product[];

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type Product", () => {
      json.forEach((product) => {
        expect(product).toMatchObject({
          id: expect.any(String),
          stripeProductId: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          active: expect.any(Boolean),
          features: expect.any(Array),
          imageUrls: expect.any(Array),
          price: expect.any(String),
          currency: expect.any(String),
          recurringInterval: expect.any(String),
          recurringCount: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    it("should match mockProduct", () => {
      expect(json[0].name).toEqual("Test Product");
      expect(json[0].description).toEqual("Test Description");
      expect(json[0].active).toEqual(true);
      expect(json[0].features).toEqual(["Test Feature"]);
      expect(json[0].imageUrls).toEqual(["Test Image URL"]);
      expect(json[0].price).toEqual("2.99");
      expect(json[0].currency).toEqual("usd");
      expect(json[0].recurringInterval).toEqual("month");
      expect(json[0].recurringCount).toEqual(1);
    });
  });

  describe(`GET /api/${apiVersion}/product/:id`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/product/5415b2f9-9ccd-41bb-bb5a-39d66a895d77`,
    );

    const json = (await response.json()) as Product;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type Product", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        stripeProductId: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        active: expect.any(Boolean),
        features: expect.any(Array),
        imageUrls: expect.any(Array),
        price: expect.any(String),
        currency: expect.any(String),
        recurringInterval: expect.any(String),
        recurringCount: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockProduct", () => {
      expect(json.name).toEqual("Test Product");
      expect(json.description).toEqual("Test Description");
      expect(json.active).toEqual(true);
      expect(json.features).toEqual(["Test Feature"]);
      expect(json.imageUrls).toEqual(["Test Image URL"]);
      expect(json.price).toEqual("2.99");
      expect(json.currency).toEqual("usd");
      expect(json.recurringInterval).toEqual("month");
      expect(json.recurringCount).toEqual(1);
    });
  });

  describe(`POST /api/${apiVersion}/product/:id/delete`, async () => {
    const response = await fetch(
      `${apiUrl}/${apiVersion}/product/5415b2f9-9ccd-41bb-bb5a-39d66a895d77/delete`,
      {
        method: "POST",
      },
    );

    const json = (await response.json()) as Product;

    it("should return 200", () => {
      expect(response.status).toEqual(200);
    });

    it("should return a JSON object", () => {
      expect(response.headers.get("content-type")).toContain(
        "application/json",
      );
    });

    it("should match type Product", () => {
      expect(json).toMatchObject({
        id: expect.any(String),
        stripeProductId: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        active: expect.any(Boolean),
        features: expect.any(Array),
        imageUrls: expect.any(Array),
        price: expect.any(String),
        currency: expect.any(String),
        recurringInterval: expect.any(String),
        recurringCount: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should match mockProduct", () => {
      expect(json.name).toEqual("Test Product");
      expect(json.description).toEqual("Test Description");
      expect(json.active).toEqual(true);
      expect(json.features).toEqual(["Test Feature"]);
      expect(json.imageUrls).toEqual(["Test Image URL"]);
      expect(json.price).toEqual("2.99");
      expect(json.currency).toEqual("usd");
      expect(json.recurringInterval).toEqual("month");
      expect(json.recurringCount).toEqual(1);
    });
  });
});
