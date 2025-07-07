import type { Route } from "./+types/home";
import { type MetaArgs } from "react-router";
import { ListGroup } from "react-bootstrap";
import { Posts } from "client/posts/posts.server";
import { authenticate } from "~/helpers/authenticate.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  let user = await authenticate(request);
  if (!user) await authenticator.authenticate("cognito", request);
  const posts = await Posts.list(request);
  return posts || [];
};

export function meta({}: MetaArgs) {
  return [
    { title: "Posts? You can't handle the posts..." },
    { name: "description", content: "Posts!" },
  ];
}

const Home = ({ loaderData }: Route.ComponentProps) => {
  const posts = loaderData;
  return posts?.map(({ postId, title, content }) => (
    <ListGroup.Item key={postId} action className="text-nowrap text-truncate">
      <span className="fw-bold">{title?.trim().split("\n")[0]}</span>
      <br />
      <span className="text-muted">{content?.trim().split("\n")[0]}</span>
      <br />
      <span className="text-muted">Created: date goes here</span>
    </ListGroup.Item>
  ));
};

export default Home;
