import { bus } from "./bus";

// Secrets
export const cookieSecret = new sst.Secret("CookieSecret");

// Databases
export const session = new sst.aws.Dynamo("Session", {
  fields: {
    Username: "string",
  },
  primaryIndex: { hashKey: "Username" },
  ttl: "expires",
});

export const postsTable = new sst.aws.Dynamo("Posts", {
  fields: {
    postId: "string",
    isApproved: "number",
    createdAt: "number",
  },
  primaryIndex: {
    hashKey: "postId",
  },
  globalIndexes: {
    ApprovedIndex: { hashKey: "isApproved", rangeKey: "createdAt" },
  },
  stream: "new-image",
});

postsTable.subscribe(
  "PostsSubscribe",
  {
    handler: "functions/stream.main",
    link: [bus],
  },
  {
    filters: [
      {
        eventName: ["INSERT"],
      },
    ],
  }
);
