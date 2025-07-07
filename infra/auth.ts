import { api } from "./api";

const region = aws.getRegionOutput().name;

export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  usernames: ["email"],
});

export const domain = new aws.cognito.UserPoolDomain("UserPoolDomain", {
  domain: "gw-assessment-auth",
  userPoolId: userPool.id,
});

export const userPoolClient = userPool.addClient("UserPoolClient", {
  transform: {
    client: {
      generateSecret: true,
      callbackUrls: ["http://localhost:5173/auth/callback"],
    },
  },
});

export const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
  userPools: [
    {
      userPool: userPool.id,
      client: userPoolClient.id,
    },
  ],
  permissions: {
    authenticated: [
      {
        actions: ["execute-api:*"],
        resources: [
          $concat(
            "arn:aws:execute-api:",
            region,
            ":",
            aws.getCallerIdentityOutput({}).accountId,
            ":",
            api.nodes.api.id,
            "/*/*/*"
          ),
        ],
      },
    ],
  },
});
