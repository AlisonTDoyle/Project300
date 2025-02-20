import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './routes/admin-dashboard/admin-dashboard.component';
import { ScheduleComponent } from './routes/schedule/schedule.component';
import { RoomManagerComponent } from './components/admin-dashboard/room-manager/room-manager.component';

export const routes: Routes = [
    {
        path: '',
        component: ScheduleComponent
    },
    {
        path: 'schedule',
        redirectTo: '/'
    },
    {
        path: 'admin',
        title: 'Admin Dashboard',
        component: AdminDashboardComponent,
        children: [
            {
                path: 'room-manager',
                title: 'Room Manager',
                pathMatch: 'full',
                component: RoomManagerComponent
            }
        ]
    },
];
