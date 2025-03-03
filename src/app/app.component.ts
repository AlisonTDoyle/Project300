import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

/*******************************************************/
// Issues:
// - When the user imports a schedule the upcoming subject will not update.
// - Buttons need to be styled.

@Component
({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit 
{
  title = 'TimetableApplication';

  protected schedule: any[] = [];
  protected upcomingSubject: string = '';
  protected calendarOptions: CalendarOptions = 
  {
    themeSystem: 'bootstrap5',
    eventColor: '#004345',
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, dayGridPlugin, bootstrap5Plugin],

    headerToolbar: 
    {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,dayGridWeek',
    },

    weekends: false,
    allDaySlot: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '18:00:00',
  };

  protected timeblockForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient) 
  {
    this.timeblockForm = _formBuilder.group({});
  }

  ngOnInit() 
  {
    this.loadSchedule();
  }

  // ***********************************************************************************************
  // Loading the Schedule.
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
