import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Resource } from "sst";
import { getSession } from "~/services/sessions.server";
import { Sha256 } from "@aws-crypto/sha256-js";
import { SignatureV4 } from "@smithy/signature-v4";
import { HttpRequest } from "@smithy/protocol-http";
import { getCredentials } from "client/api.server";

export const authenticate = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  let session = await getSession(cookieHeader);
  let user = session.get("user");
  if (user) return user;
  return null;
};

// export const credentialsFromIdentityPool = async (
//   headers: Record<string, string> = {},
//   postInput: PostInput,
//   request: Request
// ) => {
//   const url = new URL(Resource.Api.url);
//   console.log(`URL PATH: ${url.pathname}`);
//   const rawRequest = new HttpRequest({
//     hostname: url.hostname,
//     path: "/posts",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       host: url.hostname,
//       ...headers,
//     },
//     body: JSON.stringify(postInput),
//   });
//   console.log("calling for credentials");
//   const credentials = await getCredentials(request);
//   const signer = new SignatureV4({
//     credentials: {
//       accessKeyId: credentials.accessKeyId,
//       secretAccessKey: credentials.secretAccessKey,
//       sessionToken: credentials.sessionToken,
//     },
//     service: "execute-api",
//     region: process.env.AWS_REGION!,
//     sha256: Sha256,
//   });
//   console.log(await signer.sign(rawRequest));
//   return await signer.sign(rawRequest);
//   //   console.log(`CREDENTIALS ${JSON.stringify(await signer.sign(rawRequest))}`);
// };
