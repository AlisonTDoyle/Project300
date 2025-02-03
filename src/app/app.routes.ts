import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './routes/admin-dashboard/admin-dashboard.component';
import { ScheduleComponent } from './routes/schedule/schedule.component';
import { UnauthorizedComponent } from './routes/unauthorized/unauthorized.component';
import { LoginComponent } from './routes/login/login.component';
import { SignupComponent } from './routes/signup/signup.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: ScheduleComponent },
  { path: 'schedule', redirectTo: '/' },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '' },
];
