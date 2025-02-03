import { Component } from '@angular/core';
import Auth from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { signUp } from '@aws-amplify/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent 
{
  async signup(username:string, password:string, email:string) 
  {
    try 
    {
      await signUp
      ({
        username: username,
        password: password,
        options: 
        {
          userAttributes: { email: email },
        }
      });
      console.log('Sign up successful');
    } 
    catch (error) 
    {
      console.error('Sign up error:', error);
    }
  }
}