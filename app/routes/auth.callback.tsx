import { authenticator } from "~/services/auth.server";
import type { Route } from "./+types/auth.callback";
import { redirect } from "react-router";
import { commitSession, getSession } from "~/sessions.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  let user = await authenticator.authenticate("cognito", request);

  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", user);

  const headers = new Headers({ "Set-Cookie": await commitSession(session) });

  return redirect("/", { headers });
};
