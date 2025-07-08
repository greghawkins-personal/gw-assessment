import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Resource } from "sst";
import { getSession } from "~/services/sessions.server";
import { HttpRequest, type IHttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import {
  CognitoIdentityProviderClient,
  GetTokensFromRefreshTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const getCredentials = async (request: Request) => {
  // get idtoken from refresh
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const RefreshToken = session.get("refreshToken");
  const client = new CognitoIdentityProviderClient();

  const { AuthenticationResult } = await client.send(
    new GetTokensFromRefreshTokenCommand({
      RefreshToken,
      ClientId: Resource.UserPoolClient.id,
      ClientSecret: Resource.UserPoolClient.secret,
    })
  );
  if (!AuthenticationResult) throw new Error("Could not authenticate user");

  const { IdToken } = AuthenticationResult;
  if (!IdToken) throw new Error("No valid IdToken for user");

  const credentials = fromCognitoIdentityPool({
    identityPoolId: Resource.IdentityPool.id,
    logins: {
      [`cognito-idp.${import.meta.env.VITE_REGION}.amazonaws.com/${
        Resource.UserPool.id
      }`]: IdToken,
    },
  });

  const cognitoIdentity = new CognitoIdentityClient({
    credentials,
  });
  return await cognitoIdentity.config.credentials();
};

type BuildRequestOpts = {
  url: URL;
  method: string;
  body?: Record<string, string>;
  headers?: Record<string, string>;
};

const buildRequest = ({ url, method, body, headers = {} }: BuildRequestOpts) =>
  new HttpRequest({
    hostname: url.hostname,
    path: url.pathname,
    method,
    headers: {
      "Content-Type": "application/json",
      host: url.hostname,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

const signWithAuthorisedRole = async (
  smithyRequest: IHttpRequest,
  request: Request
) => {
  const credentials = await getCredentials(request);
  const signer = new SignatureV4({
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
    service: "execute-api",
    region: process.env.AWS_REGION!,
    sha256: Sha256,
  });
  return signer.sign(smithyRequest);
};

export type SendApiOperationOpts = {
  method: string;
  body?: Record<string, string>;
  url: URL;
  headers?: Record<string, string>;
  credentialsRequest: Request;
  signRequest: boolean;
};

export const sendApiOperation = async ({
  url,
  headers,
  body,
  credentialsRequest,
  method,
  signRequest,
}: SendApiOperationOpts) => {
  const smithyRequest = buildRequest({ url, method, body, headers });

  const request = signRequest
    ? await signWithAuthorisedRole(smithyRequest, credentialsRequest)
    : smithyRequest;

  const response = await fetch(url, request);

  if (!response.ok) {
    throw new Error(
      `Received non-OK response code from ${url}: ${response.status}`
    );
  }

  const result = await response.json();
  return result;
};
