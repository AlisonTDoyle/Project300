import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoomManagerComponent } from "../../components/admin-dashboard/room-manager/room-manager.component";
import { AdminHeaderComponent } from '../../components/admin-dashboard/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RoomManagerComponent,
    AdminHeaderComponent
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})

export class AdminDashboardComponent {
 
}
