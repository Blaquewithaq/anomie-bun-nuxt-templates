import { clientId } from "~/tests/shared";

// Sets a cookie: anomie-client-id with the client ID.
// Then return a HeadersInit object with the cookie.
export const useAuthHeader = (): HeadersInit => {
  const cookieRecord = {
    cookie: `anomie-client-id=${clientId}`,
  };

  const headers: HeadersInit = {
    ...(cookieRecord.cookie && { cookie: cookieRecord.cookie }),
  };

  return headers;
};
