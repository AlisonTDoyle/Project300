import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin, { EventDragStopArg } from '@fullcalendar/interaction'
import * as bootstrap from "bootstrap";
import timeGridPlugin from '@fullcalendar/timegrid'
import { AdminDashboardComponent } from '../../routes/admin-dashboard/admin-dashboard.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseApiService } from '../../services/database-api/database-api.service';
import { Room } from '../../interfaces/room';
import { TimetableApiService } from '../../services/timetable-api/timetable-api.service';
import { StudentGroup } from '../../interfaces/student-group';
import { EventManagementFormComponent } from '../admin-dashboard/event-management-form/event-management-form.component';
import { RoomManagerComponent } from '../admin-dashboard/room-manager/room-manager.component';

@Component({
  selector: 'app-search-for-timetable',
  imports: [
    FullCalendarModule,
    CommonModule,
    AdminDashboardComponent,
    RoomManagerComponent,
    EventManagementFormComponent
    ],
  templateUrl: './search-for-timetable.component.html',
  styleUrl: './search-for-timetable.component.scss',
  standalone: true
})
export class SearchForTimetableComponent implements OnInit {
  // Properties
  private _studentGroupsCursor: object = {};

  protected selectedStudentGroup: StudentGroup | null = null;
  protected event:object = {};
  protected studentGroups: StudentGroup[] = [];
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
    events: [],
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
  protected loadingTimetable: boolean = false;

  @ViewChild('programPreview') calendarComponent: FullCalendarComponent | null = null;

// Constructor
constructor(private _databaseApi:DatabaseApiService, private _timetableApi:TimetableApiService) { }

// Event handlers
ngOnInit(): void {
  this.FetchStudentGroups();
}

protected StudentGroupClicked(studentGroup: StudentGroup): void {
  // Set selected student group
  this.selectedStudentGroup = studentGroup;

  // Fetch timetable for student group
  this.loadingTimetable = true;
  this.FetchTimetableForStudentGroup(studentGroup);
}

// Methods
private FetchStudentGroups(): void {
  this._databaseApi.ReadStudentGroupsWithPagination(20, this._studentGroupsCursor).subscribe((res) => {
    this.studentGroups = res.studentGroups;

    this._studentGroupsCursor = res.cursor;
  });
}

private FetchTimetableForStudentGroup(studentGroup: StudentGroup): void {
  // Get the calendar API
  let calendarApi = this.calendarComponent?.getApi();

  // Fetch the timetable for the selected student group
  if (calendarApi != null) {
    // Clear the current events
    calendarApi.removeAllEvents();

    // Fetch the timetable for the selected student group
    this._timetableApi.ReadSudentGroupTimetable(studentGroup.StudentGroup).subscribe((res:any) => {
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

      this.loadingTimetable = false;
    });
  }
}
}
