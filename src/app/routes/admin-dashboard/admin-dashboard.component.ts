import { Component } from '@angular/core';
import { FullCalendarModule} from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})

export class AdminDashboardComponent {
  // Properties
  protected calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [
      dayGridPlugin
    ]
  };
}
