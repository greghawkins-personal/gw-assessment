import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  type PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import type { Context, DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { Resource } from "sst";

const client = new DynamoDBClient({});

export const main = (event: DynamoDBStreamEvent, context: Context) => {
  event.Records.map(async (record) => {
    await handleRecord(record);
  });
};

const handleRecord = async (record: DynamoDBRecord) => {
  const { dynamodb, eventName } = record;

  if (!dynamodb?.NewImage) {
    `Received ${eventName} event without NewImage. Skipped processing.`;
  }
  const params: PutItemCommandInput = {
    TableName: Resource.PostsArchive.name,
    Item: dynamodb?.NewImage as Record<string, AttributeValue>,
  };
  const putCommand = new PutItemCommand(params);

  client.send(putCommand);
};
