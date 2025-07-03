import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";
import {
  GetUserCommand,
  CognitoIdentityProviderClient,
  type GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";

const cognitoClient = new CognitoIdentityProviderClient({});

export const authenticator = new Authenticator<GetUserCommandOutput>();

authenticator.use(
  new OAuth2Strategy(
    {
      clientId: Resource.UserPoolClient.id,
      clientSecret: Resource.UserPoolClient.secret,

      authorizationEndpoint:
        "https://eu-west-2ybro65asr.auth.eu-west-2.amazoncognito.com/oauth2/authorize",
      tokenEndpoint:
        "https://eu-west-2ybro65asr.auth.eu-west-2.amazoncognito.com/oauth2/token",
      redirectURI: "http://localhost:5173/auth/callback",
    },
    async ({ tokens, request }) => {
      const AccessToken = tokens.accessToken();
      //   console.log(tokens);
      return await cognitoClient.send(new GetUserCommand({ AccessToken }));
    }
  ),
  "cognito"
);
