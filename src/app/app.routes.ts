import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './routes/admin-dashboard/admin-dashboard.component';
import { ScheduleComponent } from './routes/schedule/schedule.component';
import { RoomManagerComponent } from './components/admin-dashboard/room-manager/room-manager.component';
import { StaffManagerComponent } from './components/admin-dashboard/staff-manager/staff-manager.component';
import { StudentGroupsManagerComponent } from './components/admin-dashboard/student-groups-manager/student-groups-manager.component';

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
                path: '',
                redirectTo: 'room-manager',
                pathMatch: 'full'
            },
            {
                path: 'room-manager',
                title: 'Room Manager',
                pathMatch: 'full',
                component: RoomManagerComponent
            },
            {
                path: 'staff-manager',
                title: 'Staff Manager',
                pathMatch: 'full',
                component: StaffManagerComponent    
            },
            {
                path: 'student-groups-manager',
                title: 'Student Groups Manager',
                pathMatch: 'full',
                component: StudentGroupsManagerComponent
            }
        ]
    },
];

