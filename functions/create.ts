import * as uuid from "uuid";
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Util } from "./utils/handler";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  let data = {
    content: "",
    title: "",
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Resource.Posts.name,
    Item: {
      postId: uuid.v1(),
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      content: data.content,
      title: data.title,
      isApproved: 0,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify(params.Item);
});
