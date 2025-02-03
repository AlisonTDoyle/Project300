import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
            authority: 'https://eu-west-1henv86fnl.auth.eu-west-1.amazoncognito.com',
            redirectUrl: window.location.origin,
            postLogoutRedirectUri: window.location.origin,
            clientId: 'please-enter-clientId',
            scope: 'please-enter-scopes', // 'openid profile ' + your scopes
            responseType: 'code',
            silentRenew: false,
            renewTimeBeforeTokenExpiresInSeconds: 10,
        }
}
