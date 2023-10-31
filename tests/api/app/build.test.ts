import { expect, describe, it } from "bun:test";
import { apiUrl, apiVersion, buildId } from "~/tests/shared";
import { buildMock } from "~/tests/shared/mock";

describe("api", () => {
  describe("app", () => {
    describe("build", () => {
      describe(`POST /api/${apiVersion}/app/build/create`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/build/create`,
          {
            method: "POST",
            body: JSON.stringify({
              codename: buildMock.codename,
              changelog: buildMock.changelog,
              buildDate: buildMock.buildDate,
              version: buildMock.version,
            }),
          },
        );

        const json = (await response.json()) as AppBuild;

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppBuild", () => {
          expect(json).toMatchObject({
            id: expect.any(String),
            codename: expect.any(String),
            changelog: expect.any(String),
            buildDate: expect.any(String),
            version: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            targets: expect.any(Array),
          });
        });
      });

      describe(`POST /api/${apiVersion}/app/build/:id/update`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/build/${buildId}/update`,
          {
            method: "POST",
            body: JSON.stringify({
              codename: buildMock.codename + "-updated",
              changelog: buildMock.changelog + "-updated",
              buildDate: buildMock.buildDate + "-updated",
              version: buildMock.version + "-updated",
            }),
          },
        );

        const json = (await response.json()) as AppBuild;

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppBuild", () => {
          expect(json).toMatchObject({
            id: expect.any(String),
            codename: expect.any(String),
            changelog: expect.any(String),
            buildDate: expect.any(String),
            version: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            targets: expect.any(Array),
          });
        });

        it("should match buildMock", () => {
          expect(json.codename).toEqual(buildMock.codename + "-updated");
          expect(json.changelog).toEqual(buildMock.changelog + "-updated");
          expect(json.buildDate).toEqual(buildMock.buildDate + "-updated");
          expect(json.version).toEqual(buildMock.version + "-updated");
        });
      });

      describe(`GET /api/${apiVersion}/app/build`, async () => {
        const response = await fetch(`${apiUrl}/${apiVersion}/app/build`);

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppBuild", async () => {
          const json = (await response.json()) as AppBuild[];

          json.forEach((item) => {
            expect(item).toMatchObject({
              id: expect.any(String),
              codename: expect.any(String),
              changelog: expect.any(String),
              buildDate: expect.any(String),
              version: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              targets: expect.any(Array),
            });
          });
        });
      });

      describe(`GET /api/${apiVersion}/app/build/:id`, async () => {
        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/build/${buildId}`,
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a JSON object", () => {
          expect(response.headers.get("content-type")).toContain(
            "application/json",
          );
        });

        it("should match type AppBuild", async () => {
          const json = await response.json();

          expect(json).toMatchObject({
            id: expect.any(String),
            codename: expect.any(String),
            changelog: expect.any(String),
            buildDate: expect.any(String),
            version: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            targets: expect.any(Array),
          });
        });
      });

      describe(`POST /api/${apiVersion}/app/build/:id/delete`, async () => {
        const deleteMe = await fetch(
          `${apiUrl}/${apiVersion}/app/build/create`,
          {
            method: "POST",
            body: JSON.stringify({
              codename: buildMock.codename + "-delete",
              changelog: buildMock.changelog + "-delete",
              buildDate: buildMock.buildDate + "-delete",
              version: buildMock.version + "-delete",
            }),
          },
        );

        const deleteMeJson = (await deleteMe.json()) as AppBuild;
        const buildId = deleteMeJson.id;

        const response = await fetch(
          `${apiUrl}/${apiVersion}/app/build/${buildId}/delete`,
          {
            method: "POST",
          },
        );

        it("should return 200", () => {
          expect(response.status).toEqual(200);
        });

        it("should return a string", () => {
          expect(response.headers.get("content-type")).toContain("text/html");
        });
      });
    });
  });
});
