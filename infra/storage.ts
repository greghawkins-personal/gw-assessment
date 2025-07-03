export const session = new sst.aws.Dynamo("Session", {
  fields: {
    Username: "string",
  },
  primaryIndex: { hashKey: "Username" },
});
