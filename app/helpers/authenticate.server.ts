import { getSession } from "~/services/sessions.server";

export const authenticate = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  let session = await getSession(cookieHeader);
  let user = session.get("user");
  if (user) return user;
  return null;
};
