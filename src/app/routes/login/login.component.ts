import { Component } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  async login() {
    try {
      await Auth.signIn(this.username, this.password);
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
}
