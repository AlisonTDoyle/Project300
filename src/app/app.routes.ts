import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './routes/admin-dashboard/admin-dashboard.component';
import { ScheduleComponent } from './routes/schedule/schedule.component';
import { CommonModule } from '@angular/common';
import { AdminAuthComponent } from './routes/admin-auth/admin-auth.component';

export const routes: Routes = [
    { path: '', component: ScheduleComponent },
    { path: 'schedule', redirectTo: '/'},
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'signin', component: AdminAuthComponent}
];
