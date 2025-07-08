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
      authorizationEndpoint: `https://${
        import.meta.env.VITE_USER_POOL_DOMAIN
      }.auth.eu-west-2.amazoncognito.com/oauth2/authorize`,
      tokenEndpoint: `https://${
        import.meta.env.VITE_USER_POOL_DOMAIN
      }.auth.eu-west-2.amazoncognito.com/oauth2/token`,
      redirectURI: `${import.meta.env.VITE_CALLBACK_URL}`,
    },
    async ({ tokens }) => {
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
