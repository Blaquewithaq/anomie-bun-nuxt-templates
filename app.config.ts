export default defineAppConfig({
  anomie: {
    app: {
      name: "AnomieTemplate",
      version: "0.0.1",
      description: "Nuxt 3 template",
      website: "",
    },
    settings: {},
    ui: {
      loadingIndicator: {
        color: "#fff",
        background: "#000",
        height: 5, // rem
      },
    },
  } as AnomieConfig,
});
