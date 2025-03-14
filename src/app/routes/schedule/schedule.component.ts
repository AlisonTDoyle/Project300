import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import * as bootstrap from "bootstrap"

import { DatabaseApiService } from '../../services/database-api/database-api.service';
import { Room } from '../../interfaces/room';
import { TimetableApiService } from '../../services/timetable-api/timetable-api.service';
import { StudentGroup } from '../../interfaces/student-group';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search/search.service';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive,FullCalendarModule, CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  title = 'TimetableApplication';

  protected schedule: any[] = [];
  protected upcomingSubject: string = '';

  private _studentGroupsCursor: object = {};

  searchQuery: string='';
  searchItems:any[]=[];
  searchResults: any[] = [];

  protected selectedStudentGroup: StudentGroup | null = null;
  protected event:object = {};
  protected studentGroups: StudentGroup[] = [];
  protected filteredStudentGroup: StudentGroup[] = [];

  protected calendarOptions: CalendarOptions = 
  {
    // themeSystem: 'bootstrap5',
    eventColor: '#004345',
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, dayGridPlugin,bootstrap5Plugin],

    headerToolbar: 
    {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },

    weekends: false,
    allDaySlot: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '22:00:00',
    events: this.schedule,
    eventDidMount: (info) => {
      return new bootstrap.Popover(info.el, {
        title: info.event.title,
        placement: "auto",
        trigger: "hover",
        content: `<p>${info.event.extendedProps['roomNumber']} (${info.event.extendedProps['room']})</p>`,
        html: true
      })
    },
    eventContent: this.renderEventContent.bind(this)
  };

    @ViewChild('programPreview') calendarComponent: FullCalendarComponent | null = null;
    protected loadingTimetable: boolean = false;
  
    private apiUrl = "https://fsjvpth2m1.execute-api.eu-west-1.amazonaws.com/dev/search?searchtext="


  protected timeblockForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient, private _databaseApi:DatabaseApiService, private _timetableApi:TimetableApiService, private searchService: SearchService) 
  {
    this.timeblockForm = _formBuilder.group({});
  }

  ngOnInit() 
  {
    this.FetchStudentGroups();
  }

  // ***********************************************************************************************
  // Loading the Schedule. - now unused
  private loadSchedule(): void 
  {
    this.http.get<any[]>('./assets/schedule.json').subscribe(
      (data) => 
      {
        this.schedule = data;
        this.updateCalendar();
        this.checkUpcomingSubject();
      },
      (error) => 
      {
        console.error('Error loading schedule:', error);
      }
    );
  }

  //************************************************************************************************
  // search function
  onSearch(text: string): void{
    console.log('button clicked');
  
    this.http.get<any>(this.apiUrl + text).subscribe(
      (response) =>{
        this.searchResults = response.searchResults;
      },
      (error) =>{
        console.log('Error fetching data', error)
      }
    );
  }
  
  // ***********************************************************************************************
  // Fetch timetable from API
  private FetchStudentGroups(): void {
    this._databaseApi.ReadStudentGroupsWithPagination(20, this._studentGroupsCursor).subscribe((res) => {
      this.studentGroups = res.studentGroups;
  
      this._studentGroupsCursor = res.cursor;
    });
  }
  
  // ***********************************************************************************************
  // Display which timetable is clicked / selected

  protected StudentGroupClicked(studentGroup: StudentGroup): void {
    // Set selected student group
    this.selectedStudentGroup = studentGroup;
  
    // Fetch timetable for student group
    this.loadingTimetable = true;
    this.FetchTimetableForStudentGroup(studentGroup);
  }

  // ***********************************************************************************************
  // Fecth and display which timetable is selected
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

  // ***********************************************************************************************
  // Importing a Schedule.json file.
  protected importSchedule(event: Event): void
  {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) 
    {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => 
      {
        try 
        {
          const data = JSON.parse(reader.result as string);

          this.schedule = data;
          this.updateCalendar();
          this.checkUpcomingSubject();

          alert('File Imported Successfully!');
        } 
        catch (error) 
        {
          console.error('Invalid JSON file:', error);
          alert('The uploaded file is not a valid JSON schedule.');
        }
      };

      reader.readAsText(file);
    }
  }

  // ***********************************************************************************************
  // Updating the Calendar
  private updateCalendar(): void 
  {
    this.calendarOptions.events = this.schedule.map((event) => 
    ({
      ...event,
      end: this.calculateEndTime(event.startRecur, event.endTime),
    }));
  }

  // ***********************************************************************************************
  // Calculating the End Time (so we can find the next subject).
  private calculateEndTime(start: string, endTime: string): string 
  {
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startDate = new Date(start);

    startDate.setHours(endHours, endMinutes);

    return startDate.toISOString();
  }
  
  // ***********************************************************************************************
  // Check the Upcoming Subject to display to the user!
  renderEventContent(eventInfo: any) {
    return {
      html: `
        <div>
          <strong>${eventInfo.event.title}</strong>
          <br>
          <em>${eventInfo.event.extendedProps['room']}</em>
          <small>${eventInfo.event.extendedProps['roomNumber']}</small>
        </div>
      `
    };
  }

  // ***********************************************************************************************
  // Check the Upcoming Subject to display to the user!
  protected checkUpcomingSubject(): void 
  {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    let upcomingEvent = this.schedule.find((event) => 
    {
      const eventStart = new Date(event.start);
      return eventStart > now && eventStart <= oneHourLater;
    });

    if (upcomingEvent) 
    {
      this.upcomingSubject = `Upcoming Subject: ${upcomingEvent.title}`;
    } 
    else 
    {
      let nextEvent = this.schedule.find((event) => 
      {
        const eventStart = new Date(event.start);
        return eventStart > now;
      });

      if (nextEvent) 
      {
        this.upcomingSubject = `Next Subject: ${nextEvent.title}`;
      } 
      else 
      {
        this.upcomingSubject = 'All finished for today';
      }
    }
  }
}
