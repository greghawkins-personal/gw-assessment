import { getSession } from "~/services/sessions.server";

export const authenticate = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  let session = await getSession(cookieHeader);
  return session.get("user");
};
