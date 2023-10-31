<template>
  <div>
    <button @click="createCheckout()">
      <span>Buy Now</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const createCheckout = async () => {
  const { data } = await useFetch<{ url: string }>(
    "/api/v1/stripe/checkout/create-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: "0b7a8a90-1f7e-4f1f-8e1c-0f4b94876f8c",
      }),
    },
  );

  navigateTo(data.value?.url);
};
</script>
