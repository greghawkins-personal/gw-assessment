export type Post = {
  postId: string;
  userId: string;
  content: string;
  title: string;
  createdAt: Date;
};

export type CreatePostInput = {
  title: string;
  content: string;
};
