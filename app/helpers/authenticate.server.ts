import { authenticator } from "~/services/auth.server";
import { getSession, sessionCookie } from "~/sessions.server";

export const authenticate = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  //   const cookie = await sessionCookie.parse(cookieHeader);
  //   console.log(`authenticate cookie: ${cookie}`);
  let session = await getSession(cookieHeader);
  let user = session.get("Item");
  //   console.log(`authenticate session: ${JSON.stringify(session)}`);
  //   console.log(`authenticate user: ${JSON.stringify(user)}`);
  if (user) return user;
  return null;
  //   return (user = await authenticator.authenticate("cognito", request));
};
