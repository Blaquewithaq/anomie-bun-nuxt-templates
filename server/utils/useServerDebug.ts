/* eslint-disable no-console */
export const consoleMessageServer = (
  type: "log" | "info" | "warn" | "error",
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...optionalParams: any[]
) => {
  if (process.env.NODE_ENV === "development") {
    console[type](message, ...optionalParams);
  }
};
