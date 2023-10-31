import { expect, describe, it } from "bun:test";
import {
  apiUrl,
  apiVersion,
  buildId,
  targetId,
  clientId,
} from "~/tests/shared";
import { clientMock } from "~/tests/shared/mock";

describe("api", () => {
  describe("app", () => {
    describe("client", () => {
      describe(`POST /api/${apiVersion}/app/client/create`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/client/create`,
          {
            method: "POST",
            body: JSON.stringify({
              online: clientMock.online,
              lastOnline: clientMock.lastOnline,
              disabled: clientMock.disabled,
              data: clientMock.data,
              buildId,
              targetId,
            }),
          },
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppClient", async () => {
          const json = (await response.json()) as AppClient;

          expect(json).toMatchObject({
            id: expect.any(String),
            online: expect.any(Boolean),
            lastOnline: expect.any(String),
            disabled: expect.any(Boolean),
            data: expect.any(Object),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            build: expect.any(Object),
            target: expect.any(Object),
          });
        });
      });

      describe(`POST /api/${apiVersion}/app/client/:id/update`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/client/${clientId}/update`,
          {
            method: "POST",
            body: JSON.stringify({
              online: clientMock.online,
              lastOnline: clientMock.lastOnline,
              disabled: clientMock.disabled,
              data: clientMock.data,
              buildId,
              targetId,
            }),
          },
        );

        const json = (await response.json()) as AppClient;

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppClient", () => {
          expect(json).toMatchObject({
            id: expect.any(String),
            online: expect.any(Boolean),
            lastOnline: expect.any(String),
            disabled: expect.any(Boolean),
            data: expect.any(Object),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            build: expect.any(Object),
            target: expect.any(Object),
          });
        });

        it("should match clientMock", () => {
          expect(json.online).toEqual(clientMock.online);
          expect(json.disabled).toEqual(clientMock.disabled);
          // expect(json.data?.browserPropertiesAllowCollect).toEqual(
          //   JSON.parse(clientMock.data.browserPropertiesAllowCollect),
          // );
        });
      });

      describe(`GET /api/${apiVersion}/app/client`, async () => {
        const response = await fetch(`${apiUrl}/${apiVersion}/app/client`);
        const json = (await response.json()) as AppClient[];

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppClient", () => {
          json.forEach((item) => {
            expect(item).toMatchObject({
              id: expect.any(String),
              online: expect.any(Boolean),
              lastOnline: expect.any(String),
              disabled: expect.any(Boolean),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              build: expect.any(Object),
              target: expect.any(Object),
            });

            if (item.data) {
              expect(item).toMatchObject({
                data: expect.any(Object),
              });
            }
          });
        });
      });

      describe(`GET /api/${apiVersion}/app/client/:id`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/client/${clientId}`,
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppClient", async () => {
          const json = await response.json();

          expect(json).toMatchObject({
            id: expect.any(String),
            online: expect.any(Boolean),
            lastOnline: expect.any(String),
            disabled: expect.any(Boolean),
            data: expect.any(Object),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            build: expect.any(Object),
            target: expect.any(Object),
          });
        });
      });

      describe(`POST /api/${apiVersion}/app/client/:id/delete`, async () => {
        const deleteMe = await fetch(
          `${apiUrl}/${apiVersion}/app/client/create`,
          {
            method: "POST",
            body: JSON.stringify({
              online: clientMock.online,
              lastOnline: clientMock.lastOnline,
              disabled: clientMock.disabled,
              data: clientMock.data,
              buildId,
              targetId,
            }),
          },
        );

        const deleteMeJson = (await deleteMe.json()) as AppClient;
        const clientId = deleteMeJson.id;

        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/client/${clientId}/delete`,
          {
            method: "POST",
          },
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain("text/html");
        });
      });
    });
  });
});
