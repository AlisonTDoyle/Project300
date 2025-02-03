import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Auth from 'aws-amplify';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { getCurrentUser } from '@aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate 
{
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> 
  {
    return from({}).pipe
    (
      map((user) => 
        {
        const groups = user.signInUserSession.accessToken.payload['cognito:groups'] || [];
        
        if (groups.includes('Admin')) 
        {
          return true;
        }

        this.router.navigate(['/unauthorized']);
        return false;
      }),
      catchError(() => 
      {
        this.router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }
}