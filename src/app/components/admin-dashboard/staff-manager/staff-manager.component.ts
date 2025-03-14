import { Component, OnInit, ViewChild } from '@angular/core';
import { EventManagementFormComponent } from '../event-management-form/event-management-form.component';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { DatabaseApiService } from '../../../services/database-api/database-api.service';
import { TimetableApiService } from '../../../services/timetable-api/timetable-api.service';
import { CommonModule } from '@angular/common';
import { Staff } from '../../../interfaces/staff';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import * as bootstrap from "bootstrap";
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-staff-manager',
  standalone: true,
  imports: [
    EventManagementFormComponent,
    FullCalendarModule,
    CommonModule
  ],
  templateUrl: './staff-manager.component.html',
  styleUrl: './staff-manager.component.scss'
})
export class StaffManagerComponent implements OnInit {
  // properties
  protected selectedStaffMember: Staff | null = null;
  protected staffMembers: Staff[] = []
  protected loadMoreStaff: boolean = true;
  protected calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [
      interactionPlugin,
      timeGridPlugin
    ],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    weekends: false,
    editable: false,
    selectable: true,
    allDaySlot: false,
    slotMinTime: "08:00:00",
    slotMaxTime: "22:00:00",
    eventColor: '#378006',
    height: 'auto',
    events: [],
    eventDidMount: (info) => {
      return new bootstrap.Popover(info.el, {
        title: info.event.title,
        placement: "auto",
        trigger: "hover",
        content: `<p>${info.event.extendedProps['roomNumber']} (${info.event.extendedProps['roomType']})</p>`,
        html: true
      })
    },
    eventClick: this.handleEventClick.bind(this),
  };
  protected event: object = {};
  protected selectedEvent: EventApi | null = null;
  protected loadingTimetable: boolean = false;

  private _staffCursor: object = {};

  @ViewChild('programPreview') calendarComponent: FullCalendarComponent | null = null;

  // Constructor
  constructor(private _databaseApi: DatabaseApiService, private _timetableApi: TimetableApiService) {
  }

  // Event handlers
  ngOnInit(): void {
    this.FetchStaffMembers();
  }

  protected handleEventClick(clickInfo: EventClickArg) {
    this.selectedEvent = clickInfo.event;
  }

  protected StudentGroupClicked(staff: Staff): void {
    // Set selected student group
    this.selectedStaffMember = staff;

    // Fetch timetable for student group
    this.loadingTimetable = true;
    this.FetchTimetableForStaff(staff);
  }

  // Methods
  protected FetchStaffMembers() {
    this._databaseApi.ReadStaffWithPagination(20, this._staffCursor).subscribe((res) => {
      res?.staff.map((group) => {
        this.staffMembers.push(group)
      });

      // check if there is more to load
      if (this._staffCursor == res.cursor || res.staff.length < 20) {
        this.loadMoreStaff = false
      }

      this._staffCursor = res.cursor;
    });
  }
  
  protected FetchTimetableForStaff(staff: Staff | null): void {
    if (staff != null) {
      // Get the calendar API
      let calendarApi = this.calendarComponent?.getApi();
      console.log(calendarApi)

      // Fetch the timetable for the selected student group
      if (calendarApi != null) {
        // Clear the current events
        calendarApi.removeAllEvents();

        // Fetch the timetable for the selected student group
        this._timetableApi.ReadStaffTimetable(staff.StaffId).subscribe((res: any) => {

          for (let i = 0; i < res.length; i++) {
            let newEvent = {
              id: res[i]?._id,
              title: `${res[i]?.ModuleCode} - ${res[i]?.Module.Name.S}`,
              startTime: res[i]?.StartTime,
              endTime: res[i]?.EndTime,
              startRecur: "2024-11-11T11:00:00.000Z",
              daysOfWeek: res[i]?.Day,
              extendedProps: {
                roomNumber: res[i]?.RoomNo,
                roomType: res[i]?.Room.Type.S,
                staffId: res[i]?.StaffId
              }
            }

            calendarApi?.addEvent(newEvent);
          }

          this.loadingTimetable = false;
        });
      }
    }
  }
}
