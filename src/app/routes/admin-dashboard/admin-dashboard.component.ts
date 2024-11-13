import { Component, OnInit } from '@angular/core';
import { FullCalendarModule} from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid';
import { ScheduleTimeBlock } from '../../interfaces/schedule-time-block';
import { Title } from '@angular/platform-browser';
import { DatabaseHandlerService } from '../../services/database-handler/database-handler.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})

export class AdminDashboardComponent implements OnInit {
  // Properties
  protected schedule:any[] = [
    {
      title: "Proffesional Development",
      start: "2024-11-11T09:00:35Z",
      end: "2024-11-11T11:00:35Z"
    },
    {
      title: "Rich App Development",
      start: "2024-11-11T11:00:35Z",
      end: "2024-11-11T14:00:35Z"
    },
    {
      title: "Soft Project Management",
      start: "2024-11-11T14:00:35Z",
      end: "2024-11-11T16:00:35Z"
    },
    {
      title: "Mobile App Development",
      start: "2024-11-12T11:00:35Z",
      end: "2024-11-12T12:00:35Z"
    },
    {
      title: "Soft Project Management",
      start: "2024-11-12T16:00:35Z",
      end: "2024-11-12T18:00:35Z"
    },
  ];

  protected calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [
      timeGridPlugin,
      dayGridPlugin
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,dayGridWeek' // user can switch between the two
    },
    weekends: false,
    allDaySlot: false,
    slotMinTime: "09:00:00",
    slotMaxTime: "21:00:00"
  };

  // Constructor
  constructor(private _databaseHandler:DatabaseHandlerService) {

  }

  // Event listeners
  ngOnInit() {
    this.calendarOptions.events = this.schedule;
  }

  // Methods
  protected ShowMockTimeblocks() {
  }

  protected SaveScheduleAsFile() {
    let scheduleAsString:string = JSON.stringify(this.schedule);
    
    this._databaseHandler.SaveTimetableAsFile(scheduleAsString);
  }
}
