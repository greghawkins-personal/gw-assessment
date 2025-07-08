/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "gw-assessment",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    await import("./infra/api");
    await import("./infra/web");
    const auth = await import("./infra/auth");
    const event = await import("./infra/bus");
    event.bus.subscribe(
      "ApprovalResponseEvent",
      {
        handler: "functions/event.main",
        link: [storage.postsTable],
      },
      {
        pattern: { detailType: ["ApprovalResponse"] },
      }
    );

    return {
      UserPool: auth.userPool.id,
      Region: aws.getRegionOutput().name,
      IdentityPool: auth.identityPool.id,
      UserPoolClient: auth.userPoolClient.id,
    };
  },
});
