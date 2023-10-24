import { cookieSettings } from "./constants/cookie";

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
    // https://nuxt.com/modules/supabase
    "@nuxtjs/supabase",

    // https://github.com/fuentesloic/nuxt3-stripe
    "@unlok-co/nuxt-stripe",

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
  devtools: { enabled: false },
  prepareKit: {
    scripts: ["server/prepare/process.ts", "server/prepare/server.ts"],
  },
  stripe: {
    server: {
      key: process.env.STRIPE_API_KEY,
      options: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        apiVersion: process.env.STRIPE_API_VERSION,
      },
    },
    client: {
      key: process.env.STRIPE_PUBLISHABLE_KEY,
      options: {
        apiVersion: process.env.STRIPE_API_VERSION,
      },
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    clientOptions: {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
    cookieName: "av",
    cookieOptions: {
      maxAge: cookieSettings.maxAge,
      sameSite: cookieSettings.sameSite,
      secure: cookieSettings.secure,
    },
    redirect: false,
  },
});
