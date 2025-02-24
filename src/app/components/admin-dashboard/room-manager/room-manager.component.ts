import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin, { EventDragStopArg } from '@fullcalendar/interaction'
import * as bootstrap from "bootstrap";
import timeGridPlugin from '@fullcalendar/timegrid'
import { AdminDashboardComponent } from '../../../routes/admin-dashboard/admin-dashboard.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseApiService } from '../../../services/database-api/database-api.service';
import { Room } from '../../../interfaces/room';

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
    events:  [
      {
        title: 'Maths',
        startTime: "9:00",
        endTime: "10:00",
        start: '2025-02-20T09:00:00',
        end: '2025-02-20T10:00:00',
        daysOfWeek: [1] // Monday
      },
      {
        title: 'Intro To Programming',
        startTime: "11:00",
        endTime: "13:00",
        start: '2025-02-20T11:00:00',
        end: '2025-02-20T13:00:00',
        daysOfWeek: [1] // Monday
      }
    ],
    eventDidMount: (info) => {
      return new bootstrap.Popover(info.el, {
        title: info.event.title,
        placement: "auto",
        trigger: "hover",
        content: `<p>${info.event.extendedProps['roomNumber']} (${info.event.extendedProps['room']})</p>`,
        html: true
      })
    },
  };

  protected roomAction:string = "Create";
  protected rooms:Room[] = [];
  private roomCursor:Object = {};

  // Constructor
  constructor(private _databaseApi:DatabaseApiService) { }

  // Event listeners
  ngOnInit(): void {
    this._databaseApi.ReadRoomsWithPagination(20, {}).subscribe((res) => {
      this.rooms = res.rooms;
      this.roomCursor = res.cursor;
    });
  }

  // Methods
}
