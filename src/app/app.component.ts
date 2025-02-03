import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    HttpClientModule,
    FormsModule // Add FormsModule to imports
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TimetableApplication';
  username: string = '';  // Define username
  password: string = '';  // Define password

  constructor(public authService: AuthService) {}

  login() {
    this.authService.login(this.username, this.password);  // Pass username and password
  }

  logout() {
    this.authService.logout();
  }
}
