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
