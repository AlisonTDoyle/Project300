import { ChangeDetectorRef, Component, OnInit, signal, ViewChild } from '@angular/core';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid'
import { ScheduleTimeBlock } from '../../interfaces/schedule-time-block';
import { DatabaseHandlerService } from '../../services/database-handler/database-handler.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import interactionPlugin, { EventDragStopArg } from '@fullcalendar/interaction'

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})

export class AdminDashboardComponent implements OnInit {
  // Properties
  protected schedule: any[] = [];
  protected calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [
      interactionPlugin,
      timeGridPlugin
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay' // user can switch between the two
    },
    weekends: false,
    editable: true,
    selectable: true,
    allDaySlot: false,
    slotMinTime: "09:00:00",
    slotMaxTime: "21:00:00",
    eventColor: '#378006',
    events: this.schedule,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    select: this.handleDateSelection.bind(this)
  };
  protected eventForm: FormGroup = new FormGroup({
    moduleName: new FormControl(''),
    day: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    roomType: new FormControl('')
  });
  protected selectedEvent: EventApi | null = null;
  currentEvents = signal<EventApi[]>([]);

  // Html elements
  @ViewChild('programPreview') calendarComponent: FullCalendarComponent | null = null;

  // Constructor
  constructor(private _databaseHandler: DatabaseHandlerService, private _formBuilder: FormBuilder, private _changeDetector: ChangeDetectorRef) {
    this.eventForm = _formBuilder.group({
      moduleName: (''),
      day: (''),
      startTime: (''),
      endTime: (''),
      roomType: (''),
    });
  }

  // Event listeners
  ngOnInit() {
    // this.calendarOptions.events = this.schedule;
  }

  onSubmit() {
    // Make sure calendar is accessable
    if (this.calendarComponent != null) {
      let calendarApi = this.calendarComponent.getApi();

      // Convert day to corresponding number
      let day: number = 0;
      switch (this.eventForm.value.day) {
        case "Monday":
          day = 1;
          break;
        case "Tuesday":
          day = 2;
          break;
        case "Wednesday":
          day = 3;
          break;
        case "Thursday":
          day = 4;
          break;
        case "Friday":
          day = 5;
          break;
      }

      // Add event to program
      let newEvent = {
        title: this.eventForm.value.moduleName,
        startTime: this.eventForm.value.startTime,
        endTime: this.eventForm.value.endTime,
        startRecur: "2024-11-11T11:00:00.000Z",
        daysOfWeek: [day],
        extendedProps: {
          room: this.eventForm.value.roomType
        }
      }

      calendarApi.addEvent(newEvent);

      this.schedule.push(newEvent)
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.selectedEvent = clickInfo.event;

    // Convert day from number to string

    this.eventForm.patchValue({
      moduleName: this.selectedEvent.title,
      day: "Monday",
      startTime: this.selectedEvent.start?.toISOString(),
      endTime: this.selectedEvent.end?.toISOString(),
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this._changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  handleDateSelection(event: DateSelectArg) {
    console.log(event)
    if (this.calendarComponent != null) {
      // Get calendar component
      let calendarApi = this.calendarComponent.getApi();

      // Get info from dates selected
      let startTime: string;
      let endTime: string;
      let day: number;

      startTime = this.ConvertMillisecondsSinceEpochToTimeStamp(event.start.getTime());
      endTime = this.ConvertMillisecondsSinceEpochToTimeStamp(event.end.getTime());

      // Create event object
      let newEvent = {
        title: "New Event",
        startTime: startTime,
        endTime: endTime,
        startRecur: "2024-11-11T11:00:00.000Z",
        daysOfWeek: [1],
        extendedProps: {
          room: this.eventForm.value.roomType
        }
      }

      // Add event to calendar
      calendarApi.addEvent(newEvent);
      this.schedule.push(newEvent);
    }
  }

  // Methods
  protected SaveScheduleAsFile(): void {
    let scheduleAsString: string = JSON.stringify(this.schedule);

    this._databaseHandler.SaveTimetableAsFile(scheduleAsString);
  }

  private ConvertMillisecondsSinceEpochToTimeStamp(duration:number): string {
    // Method from: https://stackoverflow.com/a/19700358

    let milliseconds:number = Math.floor((duration % 1000) / 100);
    let seconds:number = Math.floor((duration / 1000) % 60);
    let minutes:number = Math.floor((duration / (1000 * 60)) % 60);
    let hours:number = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let hoursAsString:string|number = (hours < 10) ? "0" + hours : hours;
    let minutesAsString:string|number = (minutes < 10) ? "0" + minutes : minutes;
    let secondsAsString:string|number = (seconds < 10) ? "0" + seconds : seconds;

    return hoursAsString + ":" + minutesAsString + ":" + secondsAsString + ":" + milliseconds;
  }
}
