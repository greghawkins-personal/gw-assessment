import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/topbar.tsx", [
    route("posts", "routes/posts.tsx"),
    route("posts/create", "routes/create-post.tsx"),
    index("./routes/home.tsx"),
  ]),
  route("auth/callback", "routes/auth.callback.tsx"),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
