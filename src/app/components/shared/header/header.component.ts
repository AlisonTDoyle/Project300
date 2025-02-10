import { Component } from '@angular/core';
import { RouterOutlet,RouterLink,RouterLinkActive } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component
({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent 
{  
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly router = inject(Router);

  configuration$ = this.oidcSecurityService.getConfiguration();
  userData$ = this.oidcSecurityService.userData$;
  isAuthenticated = false;

  ngOnInit(): void 
  {
    this.oidcSecurityService.isAuthenticated$.subscribe
    (
      ({ isAuthenticated }) => 
        {
          this.isAuthenticated = isAuthenticated;

          if (isAuthenticated) 
          {
            // Redirect to the admin dashboard after successful login
            // HELP NEEDED!
            this.router.navigate(['/admin']);
          }

          console.warn('authenticated: ', isAuthenticated);
      }
    );
  }

  login(): void 
  {
    this.oidcSecurityService.authorize();
  }

  logout(): void 
  {
    if (window.sessionStorage) 
    {
      window.sessionStorage.clear();
    }

    window.location.href = "https://eu-west-1henv86fnl.auth.eu-west-1.amazoncognito.com/logout?client_id=4c8prqqjs00mht0u4flids2mm8&logout_uri=" + window.location.origin; 
  }
}
