import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { authConfig } from './auth/auth.config';
import { provideAuth } from 'angular-auth-oidc-client';
import { importProvidersFrom } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(),
    
    importProvidersFrom(
      AuthModule.forRoot({
        config: {
          authority: 'https://eu-west-1henv86fnl.auth.eu-west-1.amazoncognito.com',
          redirectUrl: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          clientId: 'eu-west-1_henv86fnL',
          scope: 'openid profile email',
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
        },
      })
    ),

    provideAuth(authConfig), //full calender may have a soft dependancy on this. DO NOT REMOVE IT
  ]
};
