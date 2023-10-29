import { expect, describe, it } from "bun:test";
import {
  apiUrl,
  apiVersion,
  buildId,
  targetId,
  clientId,
  mockBuild,
  mockTarget,
  mockClient,
  mockAccount,
  mockAccountTwo,
} from "../shared";

// App
describe("app", () => {
  // Build
  describe("build", () => {
    describe(`POST /api/${apiVersion}/app/build/create`, async () => {
      const response = await fetch(`${apiUrl}/${apiVersion}/app/build/create`, {
        method: "POST",
        body: JSON.stringify({
          codename: mockBuild.codename,
          changelog: mockBuild.changelog,
          buildDate: mockBuild.buildDate,
          version: mockBuild.version,
        }),
      });

      it("should return 200", () => {
        expect(response.status).toEqual(200);
      });

      it("should return a JSON object", () => {
        expect(response.headers.get("content-type")).toContain(
          "application/json",
        );
      });

      it("should match type AppBuild", async () => {
        const json = (await response.json()) as AppBuild;

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
            codename: mockBuild.codename + "-updated",
            changelog: mockBuild.changelog + "-updated",
            buildDate: mockBuild.buildDate + "-updated",
            version: mockBuild.version + "-updated",
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

      it("should match mockBuild", () => {
        expect(json.codename).toEqual(mockBuild.codename + "-updated");
        expect(json.changelog).toEqual(mockBuild.changelog + "-updated");
        expect(json.buildDate).toEqual(mockBuild.buildDate + "-updated");
        expect(json.version).toEqual(mockBuild.version + "-updated");
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
      const deleteMe = await fetch(`${apiUrl}/${apiVersion}/app/build/create`, {
        method: "POST",
        body: JSON.stringify({
          codename: mockBuild.codename + "-delete",
          changelog: mockBuild.changelog + "-delete",
          buildDate: mockBuild.buildDate + "-delete",
          version: mockBuild.version + "-delete",
        }),
      });

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

      it("should return a JSON object", () => {
        expect(response.headers.get("content-type")).toContain(
          "application/json",
        );
      });
    });
  });

  // Target
  describe("target", () => {
    describe(`POST /api/${apiVersion}/app/target/create`, async () => {
      const response = await fetch(
        `${apiUrl}/${apiVersion}/app/target/create`,
        {
          method: "POST",
          body: JSON.stringify({
            name: mockTarget.name,
            description: mockTarget.description,
            platform: mockTarget.platform,
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

      it("should match type AppTarget", async () => {
        const json = (await response.json()) as AppTarget;

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
            name: mockTarget.name + "-updated",
            description: mockTarget.description + "-updated",
            platform: mockTarget.platform,
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

      it("should match mockTarget", () => {
        expect(json.name).toEqual(mockTarget.name + "-updated");
        expect(json.description).toEqual(mockTarget.description + "-updated");
        expect(json.platform).toEqual(mockTarget.platform as AppTargetPlatform);
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
            name: mockTarget.name + "-delete",
            description: mockTarget.description + "-delete",
            platform: mockTarget.platform,
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
        expect(response.headers.get("content-type")).toContain(
          "application/json",
        );
      });
    });
  });

  // Client
  describe("client", () => {
    describe(`POST /api/${apiVersion}/app/client/create`, async () => {
      const response = await fetch(
        `${apiUrl}/${apiVersion}/app/client/create`,
        {
          method: "POST",
          body: JSON.stringify({
            online: mockClient.online,
            lastOnline: new Date().toISOString(),
            disabled: mockClient.disabled,
            data: mockClient.data,
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
            online: mockClient.online,
            lastOnline: mockClient.lastOnline,
            disabled: mockClient.disabled,
            data: mockClient.data,
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

      it("should match mockClient", () => {
        expect(json.online).toEqual(mockClient.online);
        expect(json.disabled).toEqual(mockClient.disabled);

        if (json.data?.browserPropertiesAllowCollect !== undefined) {
          expect(json.data?.browserPropertiesAllowCollect).toEqual(
            mockClient.data.browserPropertiesAllowCollect,
          );
        }
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
            online: mockClient.online,
            lastOnline: mockClient.lastOnline,
            disabled: mockClient.disabled,
            data: mockClient.data,
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
        expect(response.headers.get("content-type")).toContain(
          "application/json",
        );
      });
    });
  });

  // Tools
  describe("tools", () => {
    describe(`POST /api/${apiVersion}/app/tools/is-email-available`, async () => {
      const response = await fetch(
        `${apiUrl}/${apiVersion}/app/tools/is-email-available`,
        {
          method: "POST",
          body: JSON.stringify({ email: mockAccount.email }),
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
          `${apiUrl}/${apiVersion}/app/tools/is-email-available`,
          {
            method: "POST",
            body: JSON.stringify({ email: "test2@test.com" }),
          },
        );

        const json = await response.json();
        expect(json).toEqual(true);
      });
    });

    describe(`POST /api/${apiVersion}/app/tools/is-phone-available`, async () => {
      const response = await fetch(
        `${apiUrl}/${apiVersion}/app/tools/is-phone-available`,
        {
          method: "POST",
          body: JSON.stringify({ phone: mockAccount.phone }),
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
          `${apiUrl}/${apiVersion}/app/tools/is-phone-available`,
          {
            method: "POST",
            body: JSON.stringify({ phone: "0987654321" }),
          },
        );
        const json = await response.json();
        expect(json).toEqual(true);
      });
    });

    describe(`POST /api/${apiVersion}/app/tools/is-username-available`, async () => {
      const response = await fetch(
        `${apiUrl}/${apiVersion}/app/tools/is-username-available`,
        {
          method: "POST",
          body: JSON.stringify({ username: mockAccountTwo.profile?.username }),
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
          `${apiUrl}/${apiVersion}/app/tools/is-username-available`,
          {
            method: "POST",
            body: JSON.stringify({ username: mockAccount.profile?.username }),
          },
        );
        const json = await response.json();
        expect(json).toEqual(true);
      });
    });
  });
});
