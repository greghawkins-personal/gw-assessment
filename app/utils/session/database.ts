import { createSessionStorage } from "react-router";
import { Resource } from "sst";
import type {
  SessionData,
  SessionStorage,
  SessionIdStorageStrategy,
} from "react-router";
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient();

interface ArcTableSessionStorageOptions {
  cookie?: SessionIdStorageStrategy["cookie"];
}

export const createDynamoDBTableSessionStorage = ({
  cookie,
}: ArcTableSessionStorageOptions) => {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      console.log("create data");
      console.log(data);
      console.log("cookie");
      console.log(cookie?.name);
      const session = {
        Username: data.user.Username,
        ...data,
        expires: expires?.toISOString(),
      };
      const putItemOutput = await client.send(
        new PutItemCommand({
          TableName: Resource.Session.name,
          Item: marshall(session, { removeUndefinedValues: true }),
        })
      );
      //   console.log(putItemOutput);
      return data.user.Username;
    },
    async readData(id) {
      console.log(`reading session with id: ${id}`);
      return await client.send(
        new GetItemCommand({
          TableName: Resource.Session.name,
          Key: marshall({ Username: id }),
        })
      );
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
