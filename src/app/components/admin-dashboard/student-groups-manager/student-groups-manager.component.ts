import { Component } from '@angular/core';
import { EventManagementFormComponent } from '../event-management-form/event-management-form.component';

@Component({
  selector: 'app-student-groups-manager',
  standalone: true,
  imports: [
    EventManagementFormComponent
  ],
  templateUrl: './student-groups-manager.component.html',
  styleUrl: './student-groups-manager.component.scss'
})
export class StudentGroupsManagerComponent {

}
