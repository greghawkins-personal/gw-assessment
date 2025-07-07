import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";
import {
  GetUserCommand,
  CognitoIdentityProviderClient,
  type GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { Resource } from "sst";

const cognitoClient = new CognitoIdentityProviderClient({});

type AuthenticatorReturnType = {
  user: GetUserCommandOutput;
  refreshToken: string;
};

export const authenticator = new Authenticator<AuthenticatorReturnType>();

authenticator.use(
  new OAuth2Strategy(
    {
      clientId: Resource.UserPoolClient.id,
      clientSecret: Resource.UserPoolClient.secret,
      authorizationEndpoint:
        "https://gw-assessment-auth.auth.eu-west-2.amazoncognito.com/oauth2/authorize",
      tokenEndpoint:
        "https://gw-assessment-auth.auth.eu-west-2.amazoncognito.com/oauth2/token",
      redirectURI: `http://localhost:5173/auth/callback`,
    },
    async ({ tokens }) => {
      //   console.log(tokens);
      const AccessToken = tokens.accessToken();
      const refreshToken = tokens.refreshToken();
      const user = await cognitoClient.send(
        new GetUserCommand({ AccessToken })
      );
      return { user, refreshToken };
    }
  ),
  "cognito"
);
