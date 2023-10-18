import { defineNuxtPrepareHandler } from "nuxt-prepare/config";

export default defineNuxtPrepareHandler(() => {
  return {
    // Overwrite the runtime config variables
    runtimeConfig: {},
  };
});
