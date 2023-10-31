import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, targetId } from "~/tests/shared";
import { targetMock } from "~/tests/shared/mock";

describe("api", () => {
  describe("app", () => {
    describe("target", () => {
      describe(`POST /api/${apiVersion}/app/target/create`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/target/create`,
          {
            method: "POST",
            body: JSON.stringify({
              name: targetMock.name,
              description: targetMock.description,
              platform: targetMock.platform,
            }),
          },
        );

        const json = (await response.json()) as AppTarget;

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppTarget", () => {
          expect(json).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            platform: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            builds: expect.any(Object),
          });
        });
      });

      describe(`POST /api/${apiVersion}/app/target/:id/update`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/target/${targetId}/update`,
          {
            method: "POST",
            body: JSON.stringify({
              name: targetMock.name + "-updated",
              description: targetMock.description + "-updated",
              platform: targetMock.platform,
            }),
          },
        );

        const json = (await response.json()) as AppTarget;

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppTarget", () => {
          expect(json).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            platform: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            builds: expect.any(Object),
          });
        });

        it("should match targetMock", () => {
          expect(json.name).toEqual(targetMock.name + "-updated");
          expect(json.description).toEqual(targetMock.description + "-updated");
          expect(json.platform).toEqual(
            targetMock.platform as AppTargetPlatform,
          );
        });
      });

      describe(`GET /api/${apiVersion}/app/target`, async () => {
        const response = await fetch(`${apiUrl}/${apiVersion}/app/target`);

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppTarget", async () => {
          const json = (await response.json()) as AppTarget[];

          json.forEach((item) => {
            expect(item).toMatchObject({
              id: expect.any(String),
              name: expect.any(String),
              description: expect.any(String),
              platform: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              builds: expect.any(Object),
            });
          });
        });
      });

      describe(`GET /api/${apiVersion}/app/target/:id`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/target/${targetId}`,
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppTarget", async () => {
          const json = await response.json();

          expect(json).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            platform: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            builds: expect.any(Object),
          });
        });
      });

      describe(`POST /api/${apiVersion}/app/target/:id/delete`, async () => {
        const deleteMe = await fetch(
          `${apiUrl}/${apiVersion}/app/target/create`,
          {
            method: "POST",
            body: JSON.stringify({
              name: targetMock.name + "-delete",
              description: targetMock.description + "-delete",
              platform: targetMock.platform,
            }),
          },
        );

        const deleteMeJson = (await deleteMe.json()) as AppTarget;
        const targetId = deleteMeJson.id;

        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/target/${targetId}/delete`,
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
