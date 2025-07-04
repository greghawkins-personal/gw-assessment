const region = aws.getRegionOutput().name;

export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  usernames: ["email"],
});

export const userPoolClient = userPool.addClient("UserPoolClient", {
  transform: {
    client: {
      callbackUrls: ["http://localhost:3000/auth/callback"],
      generateSecret: true,
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
  permissions: {},
});
