import type { EventBridgeEvent } from "aws-lambda";
import { Resource } from "sst";
import {
  DynamoDBClient,
  UpdateItemCommand,
  type UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";

export const main = (event: EventBridgeEvent<"ApprovalResponse", any>) => {
  const detail = event.detail;
  const isApproved = detail.approvalResponse ? 1 : 0;

  const input: UpdateItemCommandInput = {
    TableName: Resource.Posts.name,
    Key: { postId: { S: `${detail.postId}` } },
    UpdateExpression: "SET isApproved = :isApproved",
    ExpressionAttributeValues: {
      ":isApproved": { N: isApproved.toString() },
    },
  };

  const client = new DynamoDBClient({});
  const updateCommand = new UpdateItemCommand(input);

  client.send(updateCommand);
};
