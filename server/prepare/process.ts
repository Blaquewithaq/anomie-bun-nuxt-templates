import { z } from "zod";
import { defineNuxtPrepareHandler } from "nuxt-prepare/config";

export default defineNuxtPrepareHandler(() => {
  const schema = z.object({
    NODE_ENV: z.string(),
  });

  const result = schema.safeParse(process.env);

  if (!result.success) {
    serverConsoleMessage(
      "error",
      `Invalid environment variables:\n${result.error.errors
        .map((issue) => `- ${issue.path}: ${JSON.stringify(issue)}`)
        .join("\n")}`,
    );
  }

  return {
    ok: result.success,
  };
});
