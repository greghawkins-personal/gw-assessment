import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { type MetaArgs } from "react-router";
import { authenticate } from "~/helpers/authenticate.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  let user = await authenticate(request);
  console.log(`home user: ${JSON.stringify(user)}`);
  if (!user) await authenticator.authenticate("cognito", request);
  // let user = await authenticator.authenticate("cognito", request);
};

export function meta({}: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
