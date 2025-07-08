import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  EventBridgeClient,
  PutEventsCommand,
  type PutEventsRequestEntry,
} from "@aws-sdk/client-eventbridge";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { Context, DynamoDBStreamEvent, DynamoDBRecord } from "aws-lambda";
import { Resource } from "sst";

export const main = (event: DynamoDBStreamEvent, context: Context) => {
  console.log(`STREAM EVENT: ${JSON.stringify(event)}`);
  event.Records.map(async (record) => {
    handleRecord(record);
  });
};

const handleRecord = (
  record: DynamoDBRecord
): PutEventsRequestEntry | undefined => {
  const { eventName, dynamodb } = record;

  if (eventName !== "INSERT") {
    console.debug(
      `received event record that was not for INSERT event, skipping processing`
    );
    return;
  }

  if (!dynamodb?.NewImage) {
    console.debug(
      `Received ${eventName} event without NewImage. Skipped processing.`
    );
    return;
  }
  const client = new EventBridgeClient({});
  const putCommand = new PutEventsCommand({
    Entries: [
      {
        Detail: JSON.stringify(
          unmarshall(dynamodb.NewImage as Record<string, AttributeValue>)
        ),
        DetailType: "ApprovalRequest",
        Source: "source",
        EventBusName: Resource.MyBus.name,
      },
    ],
  });
  client.send(putCommand);
};
