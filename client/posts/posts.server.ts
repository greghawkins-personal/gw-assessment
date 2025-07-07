import { sendApiOperation } from "client/api.server";
import type { CreatePostInput, Post } from "./types";
import { Resource } from "sst";

export * as Posts from "./posts.server";

const buildPostsUrl = () => new URL(`${Resource.Api.url}/posts`);

export const create = async (
  request: Request,
  postInput: CreatePostInput
): Promise<Post> => {
  return await sendApiOperation({
    body: postInput,
    signRequest: true,
    url: buildPostsUrl(),
    credentialsRequest: request,
    method: "POST",
  });
};

export const list = async (request: Request): Promise<Post[]> => {
  return await sendApiOperation({
    method: "GET",
    signRequest: false,
    url: buildPostsUrl(),
    credentialsRequest: request,
  });
};
