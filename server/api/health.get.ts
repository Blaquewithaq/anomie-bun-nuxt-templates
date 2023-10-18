export function getHealth() {
  const health: Health = {
    api: {
      status: "online",
    },
  };

  return health;
}

export default defineEventHandler((_event) => {
  return getHealth();
});
