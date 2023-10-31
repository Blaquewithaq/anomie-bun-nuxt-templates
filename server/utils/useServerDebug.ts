/* eslint-disable no-console */

/**
 * Logs a message to the console based on the specified type.
 *
 * @param type - The type of console message ("log", "info", "warn", or "error").
 * @param message - The message to be logged.
 * @param optionalParams - Optional additional parameters to be logged.
 */
export function serverConsoleMessage(
  type: "log" | "info" | "warn" | "error",
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...optionalParams: any[]
) {
  if (process.env.NODE_ENV === "development") {
    console[type](message, ...optionalParams);
  }
}

/**
 * Logs a message to the console based on the specified type.
 *
 * @param type - The type of console message ("log", "info", "warn", or "error").
 * @param message - The message to be logged.
 * @param optionalParams - Optional additional parameters to be logged.
 */
export function serverConsoleMessageDebug(
  type: "log" | "info" | "warn" | "error",
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...optionalParams: any[]
) {
  if (process.env.NODE_ENV === "development") {
    console[type](message, ...optionalParams);
  }
}
