import { Component, OnInit, ViewChild } from '@angular/core';
import { EventManagementFormComponent } from '../event-management-form/event-management-form.component';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import * as bootstrap from "bootstrap";
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatabaseApiService } from '../../../services/database-api/database-api.service';
import { TimetableApiService } from '../../../services/timetable-api/timetable-api.service';
import { CommonModule } from '@angular/common';
import { StudentGroup } from '../../../interfaces/student-group';

@Component({
  selector: 'app-student-groups-manager',
  standalone: true,
  imports: [
    EventManagementFormComponent,
    FullCalendarModule,
    CommonModule
  ],
  templateUrl: './student-groups-manager.component.html',
  styleUrl: './student-groups-manager.component.scss'
})
export class StudentGroupsManagerComponent implements OnInit {
  // Properties
  private _studentGroupsCursor: object = {};
  private _selectedStudentGroup: StudentGroup | null = null;

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

  @ViewChild('programPreview') calendarComponent: FullCalendarComponent | null = null;

  // Constructor
  constructor(private _databaseApi: DatabaseApiService, private _timetableApi: TimetableApiService) {
  }

  // Event handlers
  ngOnInit(): void {
    this.FetchStudentGroups();
  }

  protected StudentGroupClicked(studentGroup: StudentGroup): void {
    // Set selected student group
    this._selectedStudentGroup = studentGroup;

    // Fetch timetable for student group
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
      });
    }
  }
}
