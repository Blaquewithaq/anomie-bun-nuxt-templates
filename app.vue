<template>
  <Html>
    <Body>
      <NuxtLoadingIndicator
        :color="anomie.ui.loadingIndicator.color"
        :height="anomie.ui.loadingIndicator.height"
      />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<script setup lang="ts">
const anomie = useAppConfig().anomie;

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - ${anomie.app.name}`
      : `${anomie.app.name}`;
  },
  link: [
    { rel: "icon", href: "/favicon.ico", sizes: "any" },
    // { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  ],
  meta: [
    { charset: "utf-8" },
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, viewport-fit=cover",
    },
    {
      name: "description",
      content: anomie.app.description,
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    {
      "http-equiv": "Permissions-Policy",
      content: "interest-cohort=()",
    },
  ],
  noscript: [{ innerHTML: "This website requires JavaScript." }],
});
</script>
