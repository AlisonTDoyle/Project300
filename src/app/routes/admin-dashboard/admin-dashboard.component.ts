import { ChangeDetectorRef, Component, OnInit, signal, ViewChild } from '@angular/core';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid'
import { ScheduleTimeBlock } from '../../interfaces/schedule-time-block';
import { DatabaseHandlerService } from '../../services/database-handler/database-handler.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import interactionPlugin from '@fullcalendar/interaction'

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
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)

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
      calendarApi.addEvent({
        title: this.eventForm.value.moduleName,
        startTime: this.eventForm.value.startTime,
        endTime: this.eventForm.value.endTime,
        startRecur: "2024-11-11T11:00:00.000Z",
        daysOfWeek: [day],
        extendedProps: {
          room: this.eventForm.value.roomType
        }
      });
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

  // Methods
  protected AddNewTimeblock(): void {
    let startTime: Date = new Date((new Date()).setHours(9, 0, 0, 0));
    let endTime: Date = new Date((new Date()).setHours(10, 0, 0, 0));

    let newTimeblock: ScheduleTimeBlock = {
      title: "New Class",
      start: startTime.toISOString(),
      end: endTime.toISOString()
    }

    // this.schedule.push(newTimeblock);
    // this.calendarOptions.events = this.schedule;

    // console.log(this.schedule)
  }

  protected SaveScheduleAsFile(): void {
    // let scheduleAsString: string = JSON.stringify(this.schedule);

    // this._databaseHandler.SaveTimetableAsFile(scheduleAsString);
  }
}
