import { api } from "./api";
import {
  userPool,
  identityPool,
  userPoolClient,
  domain,
  callbackUrl,
} from "./auth";
import { session, cookieSecret } from "./storage";

const region = aws.getRegionOutput().name;

export const frontend = new sst.aws.React("Frontend", {
  link: [session, userPoolClient, cookieSecret, api, identityPool, userPool],
  domain: $app.stage === "production" ? "gw-assessment.com" : undefined,
  environment: {
    VITE_REGION: region,
    VITE_USER_POOL_ID: userPool.id,
    VITE_IDENTITY_POOL_ID: identityPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    VITE_USER_POOL_DOMAIN: domain.domain,
    VITE_CALLBACK_URL: callbackUrl,
  },
});
