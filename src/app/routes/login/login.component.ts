import { Component } from '@angular/core';
import Auth from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { signIn } from '@aws-amplify/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router) {}

  async login(username:string, password:string) 
  {
    try 
    {
      await signIn
      ({
        username, password
      });

      this.router.navigate(['/admin']);

    } 
    catch (error) 
    {
      console.error('Login failed:', error);
    }
  }
}
