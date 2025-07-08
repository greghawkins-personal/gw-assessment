import type { Route } from "./+types/create-post";
import { Button, Form, Stack } from "react-bootstrap";
import { redirect, useFetcher } from "react-router";
import { Posts } from "client/posts/posts.server";
import { useState } from "react";
import LoaderButton from "~/components/LoaderButton";

export const action = async ({ request }: Route.LoaderArgs) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);

  await Posts.create(request, {
    title: updates.title.toString(),
    content: updates.content.toString(),
  });
  return redirect("/");
};

const CreatePost = () => {
  const fetcher = useFetcher();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="NewPost">
      <Form>
        <Stack gap={3}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
            />
          </Form.Group>

          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control
              value={content}
              onChange={(e) => setContent(e.target.value)}
              as="textarea"
            />
          </Form.Group>

          <Stack gap={1}>
            <LoaderButton
              size="lg"
              type="button"
              onClick={() => {
                fetcher.submit(
                  { title, content },
                  {
                    method: "post",
                  }
                );
              }}
              disabled={!content && !title}
              isLoading={fetcher.state !== "idle"}
            >
              Create
            </LoaderButton>
          </Stack>
        </Stack>
      </Form>
    </div>
  );
};

export default CreatePost;
