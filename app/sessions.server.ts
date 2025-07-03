import { createCookie } from "react-router";
import { createDynamoDBTableSessionStorage } from "./utils/session/database";
import { Resource } from "sst";

export const sessionCookie = createCookie("__session", {
  secrets: [Resource.CookieSecret.value],
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

export const { getSession, commitSession, destroySession } =
  createDynamoDBTableSessionStorage({ cookie: sessionCookie });
