import { Resource } from "sst";
import type { Route } from "./+types/create-post";
import { Button, Form, Stack } from "react-bootstrap";
import { redirect, useFetcher } from "react-router";
import { Posts } from "client/posts/posts.server";
import { useState } from "react";

export const action = async ({ request }: Route.LoaderArgs) => {
  //   const { AccessToken } = await authenticator.authenticate("cognito", request);
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log("SUBMITTED");
  console.log(JSON.stringify(updates));
  console.log(Resource.Api.url);
  await Posts.create(request, {
    title: updates.title.toString(),
    content: updates.content.toString(),
  });
  return redirect("/");
  //   console.log(`Response ${JSON.stringify(response)}`);
  // call the api
};

const CreatePost = () => {
  const fetcher = useFetcher();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="NewPost">
      <div className="NewNote">
        <Form>
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

          <Stack>
            <Button
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
              variant="primary"
            >
              Create
            </Button>
          </Stack>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;
