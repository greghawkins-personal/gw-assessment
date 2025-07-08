import type { Route } from "./+types/home";
import { type MetaArgs } from "react-router";
import { ListGroup } from "react-bootstrap";
import { Posts } from "client/posts/posts.server";
import { authenticate } from "~/helpers/authenticate.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  let user = await authenticate(request);
  // if (!user) await authenticator.authenticate("cognito", request);
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

  return (
    <div className="posts">
      <h2 className="pb-3 mt-4 mb-3 border-bottom">Posts</h2>
      <ListGroup>
        {posts?.map(({ postId, title, content, createdAt }) => (
          <ListGroup.Item
            key={postId}
            action
            className="text-nowrap text-truncate"
          >
            <span className="fw-bold">{title?.trim().split("\n")[0]}</span>
            <br />
            <span className="text-muted">{content?.trim().split("\n")[0]}</span>
            <br />
            <span className="text-muted">
              Created: {new Date(createdAt).toLocaleString()}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Home;
