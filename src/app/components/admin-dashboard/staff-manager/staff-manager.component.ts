import { Component } from '@angular/core';
import { EventManagementFormComponent } from '../event-management-form/event-management-form.component';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-staff-manager',
  standalone: true,
  imports: [
    EventManagementFormComponent,
    FullCalendarModule
  ],
  templateUrl: './staff-manager.component.html',
  styleUrl: './staff-manager.component.scss'
})
export class StaffManagerComponent {
  // properties
  protected selectedStaffMember:object|null = null;
}
