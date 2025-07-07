import { api } from "./api";
import { userPool, identityPool, userPoolClient } from "./auth";
import { session, cookieSecret } from "./storage";

const region = aws.getRegionOutput().name;

export const frontend = new sst.aws.React("Frontend", {
  link: [session, userPoolClient, cookieSecret, api, identityPool, userPool],
  environment: {
    VITE_REGION: region,
    VITE_USER_POOL_ID: userPool.id,
    VITE_IDENTITY_POOL_ID: identityPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
  },
});
