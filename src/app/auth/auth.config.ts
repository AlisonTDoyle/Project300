import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = 
{
  config: 
  {
              authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_henv86fnL',
              redirectUrl: 'http://localhost:4200/admin',
              postLogoutRedirectUri: 'http://localhost:4200/',
              clientId: '4c8prqqjs00mht0u4flids2mm8',
              scope: 'email openid phone',
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
  }
}
