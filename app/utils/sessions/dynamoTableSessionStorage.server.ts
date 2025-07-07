import { createSessionStorage } from "react-router";
import { Resource } from "sst";
import type { SessionIdStorageStrategy } from "react-router";
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient();

interface DynamoTableSessionStorageOptions {
  cookie?: SessionIdStorageStrategy["cookie"];
}

export const createDynamoTableSessionStorage = ({
  cookie,
}: DynamoTableSessionStorageOptions) => {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const session = {
        Username: data.user.Username,
        ...data,
        expires: expires ? expires?.getTime() / 1000 : undefined,
      };
      await client.send(
        new PutItemCommand({
          TableName: Resource.Session.name,
          Item: marshall(session, { removeUndefinedValues: true }),
        })
      );

      return data.user.Username;
    },
    async readData(id) {
      const result = await client.send(
        new GetItemCommand({
          TableName: Resource.Session.name,
          Key: marshall({ Username: id }),
        })
      );
      return result.Item ? unmarshall(result.Item) : {};
    },
    async updateData(id, data, expires) {
      console.log("update data called");
    },
    async deleteData(id) {
      await client.send(
        new DeleteItemCommand({
          TableName: Resource.Session.name,
          Key: marshall({ id }),
        })
      );
    },
  });
};
