import type { H3Event } from "h3";

/**
 * An object representing HTTP status codes and their corresponding messages.
 */
const statusCodes: { [key: number]: string } = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently (used with redirects)",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Requested Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request header fields are too large",
  444: "Connection Closed Without Response",
  451: "Unavailable For Legal Reasons",
  499: "Client Closed Request",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
  599: "Network Connect Timeout Error",
};

/**
 * Sends a response with the specified status code.
 *
 * @param event - The H3Event object.
 * @param options - An object containing the status code and an optional status message.
 * @param options.statusCode - The HTTP status code to send.
 * @param options.statusMessage - Optional. A custom status message to include in the response.
 * @throws Error if the status code is not found in the statusCodes object.
 * @returns The result of sending an error with the specified status code and message.
 */
export function sendResponseCode(
  event: H3Event,
  {
    statusCode,
    statusMessage,
  }: {
    statusCode: number;
    statusMessage?: string;
  },
): void {
  const validStatusCodes = Object.keys(statusCodes).map(Number);

  if (!validStatusCodes.includes(statusCode)) {
    throw new Error(`Invalid status code: ${statusCode}`);
  }

  let message;

  if (statusMessage) {
    message = statusMessage;
  } else {
    message = statusCodes[statusCode];
  }

  return sendError(
    event,
    createError({
      statusCode,
      message,
    }),
  );
}

/**
 * Creates an error object with the specified status code and status message.
 *
 * @param options - An object containing the status code and an optional status message.
 * @param options.statusCode - The HTTP status code for the error.
 * @param options.statusMessage - Optional. A custom status message for the error.
 * @throws Error if the status code is not found in the statusCodes object.
 * @returns An object representing the error with the specified status code and status message.
 */
export function sendErrorCode({
  statusCode,
  statusMessage,
}: {
  statusCode: number;
  statusMessage?: string;
}): Error {
  const validStatusCodes = Object.keys(statusCodes).map(Number);

  if (!validStatusCodes.includes(statusCode)) {
    throw new Error(`Invalid status code: ${statusCode}`);
  }

  let message;

  if (statusMessage) {
    message = statusMessage;
  } else {
    message = statusCodes[statusCode];
  }

  return createError({
    statusCode,
    message,
  });
}
