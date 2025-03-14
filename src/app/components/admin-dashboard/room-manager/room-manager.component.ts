import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin, { EventDragStopArg } from '@fullcalendar/interaction'
import * as bootstrap from "bootstrap";
import timeGridPlugin from '@fullcalendar/timegrid'
import { AdminDashboardComponent } from '../../../routes/admin-dashboard/admin-dashboard.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseApiService } from '../../../services/database-api/database-api.service';
import { Room } from '../../../interfaces/room';
import { TimetableApiService } from '../../../services/timetable-api/timetable-api.service';
import { EventManagementFormComponent } from '../event-management-form/event-management-form.component';

@Component({
  selector: 'app-room-manager',
  standalone: true,
  imports: [
    EventManagementFormComponent,
    FullCalendarModule,
    CommonModule
  ],
  templateUrl: './room-manager.component.html',
  styleUrl: './room-manager.component.scss'
})
export class RoomManagerComponent implements OnInit {
  // Properties
  private _roomsCursor: object = {};

  protected selectedRoom: Room | null = {
    RoomNo: '',
    Type: '',
    Seats: 0,
    Facilities: []
  };
  protected event: object = {};
  protected rooms: Room[] = [];
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
  protected loadingTimetable: boolean = false;
  protected loadMoreRooms: boolean = true;
  protected selectedEvent: EventApi | null = null;

  @ViewChild('programPreview') calendarComponent: FullCalendarComponent | null = null;

  // Constructor
  constructor(private _databaseApi: DatabaseApiService, private _timetableApi: TimetableApiService) {
  }

  // Event 
  ngOnInit(): void {
    this.FetchRooms();
  }

  protected RoomClicked(room: Room): void {
    // Set selected room
    this.selectedRoom = room;

    // Fetch timetable for room
    this.loadingTimetable = true;
    this.FetchTimetableForRoom(room);
  }

  protected handleEventClick(clickInfo: EventClickArg) {
    this.selectedEvent = clickInfo.event;
  }

  // Methods
  protected FetchRooms(): void {
    this._databaseApi.ReadRoomsWithPagination(20, this._roomsCursor).subscribe((res) => {
      res.rooms.map((room) => {
        this.rooms.push(room)
      });

      // check if there is more to load
      if (this._roomsCursor == res.cursor || res.rooms.length < 20) {
        this.loadMoreRooms = false
      }

      this._roomsCursor = res.cursor;
    });
  }

  protected FetchTimetableForRoom(room: Room | null): void {
    if (room != null) {
      // Get the calendar API
      let calendarApi = this.calendarComponent?.getApi();

      // Fetch the timetable for the selected room
      if (calendarApi != null) {
        // Clear the current events
        calendarApi.removeAllEvents();

        // Fetch the timetable for the selected room
        this._timetableApi.ReadRoomTimetable(room.RoomNo).subscribe((res: any) => {

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
