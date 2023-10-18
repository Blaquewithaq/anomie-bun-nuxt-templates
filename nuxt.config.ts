// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // General
  app: {
    rootId: "app",
  },
  debug: process.env.NODE_ENV === "development",
  devServer: {
    https:
      process.env.SSL_ENABLED === "true"
        ? {
            cert: process.env.SSL_CERT,
            key: process.env.SSL_KEY,
          }
        : undefined,
  },
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  modules: [
    // https://nuxt-prepare.byjohann.dev/guide/getting-started.html
    "nuxt-prepare",
  ],
  runtimeConfig: {
    private: {},
    public: {},
  },
  typescript: {
    shim: false,
  },
  vite: {
    server: { https: !process.env.SSL_ENABLED },
  },

  // Modules
  devtools: { enabled: process.env.NODE_ENV === "development" },
  prepareKit: {
    scripts: ["server/prepare/process.ts", "server/prepare/server.ts"],
  },
});
