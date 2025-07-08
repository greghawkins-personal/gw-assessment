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

// const approvalResponseFunction = new sst.aws.Function("ApprovalResponseEvent", {
//   handler: "functions/event.main",
//   link: [postsTable],
// });
