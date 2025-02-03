// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { environment } from '../environments/environment';

const poolData = {
  UserPoolId: environment.cognitoUserPoolId,
  ClientId: environment.cognitoAppClientId,
};

const userPool = new CognitoUserPool(poolData);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = false;
  isAdmin = false;
  userData: any;

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      this.isAuthenticated = isAuthenticated;
      this.userData = userData;

      // Check if the user is an admin
      this.isAdmin = this.checkIfAdmin(userData);
    });
  }

  login(username: string, password: string) {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('Login successful:', result);
        this.oidcSecurityService.authorize();
      },
      onFailure: (err) => {
        console.error('Login failed:', err);
      },
    });
  }

  signup(username: string, email: string, password: string) {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        console.error('Sign up error:', err);
        return;
      }
      const cognitoUser = result?.user;
      if (cognitoUser) {
        console.log('Sign up successful:', cognitoUser);
      } else {
        console.error('Sign up result is undefined');
      }
    });
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  private checkIfAdmin(userData: any): boolean {
    const groups = userData?.['cognito:groups'] || [];
    return groups.includes('Admin');
  }
}
