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
  ttl: "expires",
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

export const postsArchive = new sst.aws.Dynamo("PostsArchive", {
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
});

postsTable.subscribe(
  "PostsArchive",
  {
    handler: "functions/archive.main",
    link: [postsArchive],
  },
  {
    filters: [
      {
        Pattern: {
          userIdentity: {
            type: ["Service"],
            principalId: ["dynamodb.amazonaws.com"],
          },
        },
      },
    ],
  }
);
