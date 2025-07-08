import { postsTable } from "./storage";

export const bus = new sst.aws.Bus("MyBus");

bus.subscribe(
  "ApprovalServiceMockEvent",
  {
    name: "ApprovalServiceMock",
    handler: "functions/approvalServiceMock/event.main",
    link: [bus],
  },
  {
    pattern: {
      detailType: ["ApprovalRequest"],
    },
  }
);
