import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Util } from "./utils/handler";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.Posts.name,
    IndexName: "ApprovedIndex",
    KeyConditionExpression: "isApproved = :isApproved",
    ExpressionAttributeValues: {
      ":isApproved": 1,
    },
    ScanIndexForward: false,
  };

  const result = await dynamoDb.send(new QueryCommand(params));

  return JSON.stringify(result.Items);
});
