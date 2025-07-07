import { postsTable } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [postsTable],
      },
    },
  },
});

api.route("POST /posts", "functions/create.main", { auth: { iam: true } });
api.route("GET /posts", "functions/list.main");
