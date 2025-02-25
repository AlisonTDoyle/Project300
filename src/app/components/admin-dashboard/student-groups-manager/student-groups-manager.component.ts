import { Component, OnInit } from '@angular/core';
import { EventManagementFormComponent } from '../event-management-form/event-management-form.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-student-groups-manager',
  standalone: true,
  imports: [
    EventManagementFormComponent,
    FullCalendarModule
  ],
  templateUrl: './student-groups-manager.component.html',
  styleUrl: './student-groups-manager.component.scss'
})
export class StudentGroupsManagerComponent implements OnInit {
  // Properties
  private _studentGroupsCursor: object = {};
  private _selectedStudentGroup: object | null = null;

  protected studentGroups: object[] = [];
  protected calendarOptions: CalendarOptions = {};

  // Constructor
  constructor() {
  }

  // Event handlers
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Methods
}
