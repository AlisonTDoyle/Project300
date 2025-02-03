import { Component } from '@angular/core';
import { Auth } from 'aws-amplify';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  async signup() {
    try {
      await Auth.signUp({
        username: this.username,
        password: this.password,
        attributes: { email: this.email },
      });
      console.log('Sign up successful');
    } catch (error) {
      console.error('Sign up error:', error);
    }
  }
}
