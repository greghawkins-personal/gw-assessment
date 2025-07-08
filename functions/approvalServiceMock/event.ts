import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type {
  AttributeValue,
  Context,
  DynamoDBRecord,
  EventBridgeEvent,
} from "aws-lambda";
import { Resource } from "sst";

export const main = (event: EventBridgeEvent<"ApprovalRequest", any>) => {
  const record = event.detail;
  console.log(`RECORD: ${JSON.stringify(record)}`);

  const approvalResponse = {
    postId: record.postId,
    approvalResponse: true,
  };

  console.log(`APPROVALRESPONSE: ${JSON.stringify(approvalResponse)}`);

  const client = new EventBridgeClient({});
  const putCommand = new PutEventsCommand({
    Entries: [
      {
        Detail: JSON.stringify(approvalResponse),
        DetailType: "ApprovalResponse",
        Source: "Approval Service Mock",
        EventBusName: Resource.MyBus.name,
      },
    ],
  });
  setTimeout(() => {
    client.send(putCommand);
  }, 10000);
};
