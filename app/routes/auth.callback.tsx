import { authenticator } from "~/services/auth.server";
import type { Route } from "./+types/auth.callback";
import { data, redirect } from "react-router";
import { commitSession, getSession } from "~/sessions.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  let user = await authenticator.authenticate("cognito", request);

  const session = await getSession(request.headers.get("Cookie"));

  console.log(`logging session: ${JSON.stringify(session)} before storage`);
  console.log("calling set on session");
  session.set("user", user);
  console.log("calling commit on session");
  // const headers = new Headers({ "Set-Cookie": await commitSession(session) });

  // return redirect("/", { headers });

  // headers: {
  //       "Set-Cookie": await commitSession(session),
  //     },

  // const cookie = request.headers.get("Cookie");
  // console.log(
  //   `console logging parsed cookie: ${await sessionCookie.parse(cookie)}`
  // );
  // console.log(`authenticate cookie: ${newCookie}`);
  // let storedSession = await getSession(newCookie);
  // let storedUser = storedSession.get("Item");
  // console.log(`storedSession: ${JSON.stringify(storedSession)}`);
  // console.log(`storedUser: ${JSON.stringify(storedUser)}`);

  // return { user, headers };
  return data(user, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const CallBackPage = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData;
  return (
    <>
      <div>{user.Username}</div>
      {/* <div>{user.storedUser.Username}</div> */}
    </>
  );
};

export default CallBackPage;
