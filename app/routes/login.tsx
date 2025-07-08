import { authenticator } from "~/services/auth.server";
import type { Route } from "./+types/login";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
  await authenticator.authenticate("cognito", request);
  redirect("/");
};
