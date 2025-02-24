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

@Component({
  selector: 'app-room-manager',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
  ],
  templateUrl: './room-manager.component.html',
  styleUrl: './room-manager.component.scss'
})
export class RoomManagerComponent implements OnInit {
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
    editable: false,
    selectable: true,
    allDaySlot: false,
    slotMinTime: "08:00:00",
    slotMaxTime: "22:00:00",
    eventColor: '#378006',
    height: 'auto',
    events:  [],
    eventDidMount: (info) => {
      return new bootstrap.Popover(info.el, {
        title: info.event.title,
        placement: "auto",
        trigger: "hover",
        content: `<p>${info.event.extendedProps['roomNumber']} (${info.event.extendedProps['room']})</p>`,
        html: true
      })
    }
  };
  protected roomAction:string = "Create";
  protected rooms:Room[] = [];

  private _roomCursor:Object = {};
  private _selectedRoom:Room|null = null;

  @ViewChild('programPreview') calendarComponent: FullCalendarComponent | null = null;

  // Constructor
  constructor(private _databaseApi:DatabaseApiService, private _timetableApi:TimetableApiService) { }

  // Event 
  ngOnInit(): void {
    this._databaseApi.ReadRoomsWithPagination(20, {}).subscribe((res) => {
      this.rooms = res.rooms;
      this._roomCursor = res.cursor;
    });
  }

  // Methods
  protected FetchRoomTimetable(room:Room) {
    // Capture the selected room
    this._selectedRoom = room;

    // Get the calendar API
    let calendarApi = this.calendarComponent?.getApi();

    // Fetch the timetable for the selected room
    if (calendarApi != null) {
      // Clear the current events
      calendarApi.removeAllEvents();

      this._timetableApi.ReadRoomTimetable(this._selectedRoom.RoomNo).subscribe((res) => {
        console.log(res);

        for (let i = 0; i < res.length; i++) {
          let newEvent = {
            title: `${res[i]?.ModuleCode} - ${res[i]?.Module.Name}`,
            startTime: res[i]?.StartTime,
            endTime: res[i]?.EndTime,
            startRecur: "2024-11-11T11:00:00.000Z",
            daysOfWeek: res[i]?.Day,
            extendedProps: {
              roomNumber: res[i]?.RoomNo
            }
          }

          calendarApi?.addEvent(newEvent);
        }
      });
    }
  }
}
