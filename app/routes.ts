import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("auth/callback", "routes/auth.callback.tsx"),
  index("routes/home.tsx"),
] satisfies RouteConfig;
