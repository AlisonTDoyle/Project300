import { Component, OnInit } from '@angular/core';
import { FullCalendarModule} from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid';
import { ScheduleTimeBlock } from '../../interfaces/schedule-time-block';
import { Title } from '@angular/platform-browser';
import { DatabaseHandlerService } from '../../services/database-handler/database-handler.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  protected schedule:any[] = [];
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
  protected timeblockForm:FormGroup;
  protected schedulePromise:Promise<EventInput[]> = {};

  // Constructor
  constructor(private _databaseHandler:DatabaseHandlerService, private _formBuilder:FormBuilder) {
    this.timeblockForm = _formBuilder.group({

    });
  }

  // Event listeners
  ngOnInit() {
    this.calendarOptions.events = this.schedule;
  }

  // Methods
  protected AddNewTimeblock():void {
    let startTime:Date = new Date((new Date()).setHours(9,0,0,0));
    let endTime:Date = new Date((new Date()).setHours(10,0,0,0));

    let newTimeblock:ScheduleTimeBlock = {
      title: "New Class",
      start: startTime.toISOString(),
      end: endTime.toISOString()
    }

    this.schedule.push(newTimeblock);
    this.calendarOptions.events = this.schedule;

    console.log(this.schedule)
  }

  protected SaveScheduleAsFile():void {
    let scheduleAsString:string = JSON.stringify(this.schedule);
    
    this._databaseHandler.SaveTimetableAsFile(scheduleAsString);
  }
}
