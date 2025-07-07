import type { Route } from "./+types/posts";
import { Welcome } from "../welcome/welcome";
import {
  BrowserRouter,
  NavLink,
  Outlet,
  Routes,
  useFetcher,
  type MetaArgs,
} from "react-router";
import { Button, Nav, Navbar, Form, Stack } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Resource } from "sst";
import { Posts } from "client/posts/posts.server";
import type { Post } from "client/posts/types";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // let user = await authenticate(request);
  // if (!user) await authenticator.authenticate("cognito", request);
  const posts: Post[] = await Posts.list(request);
  return posts;
  // console.log(JSON.stringify(await response.json()));
};

export function meta({}: MetaArgs) {
  return [
    { title: "Posts? You can't handle the posts..." },
    { name: "description", content: "Posts!" },
  ];
}

const ListPosts = ({ loaderData }: Route.ComponentProps) => {
  const posts = loaderData;
  return posts?.map((post) => post.postId);
};

export default ListPosts;
