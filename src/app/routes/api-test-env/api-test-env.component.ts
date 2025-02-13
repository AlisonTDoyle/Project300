import { Component } from '@angular/core';
import { TimetableApiService } from '../../services/timetable-api/timetable-api.service';
import { CommonModule } from '@angular/common';
import { Form, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-test-env',
  standalone: true,
  imports: [
    CommonModule
    , ReactiveFormsModule
  ],
  templateUrl: './api-test-env.component.html',
  styleUrl: './api-test-env.component.scss'
})
export class ApiTestEnvComponent {
  // Properties
  protected studentGroupSearch:FormControl = new FormControl('');
  protected staffIdSearch:FormControl = new FormControl('');
  protected roomNoSearch:FormControl = new FormControl('');

  protected studentTimetable:any = [];
  protected staffTimetable:any = [];
  protected roomTimetable:any = [];

  // Constructor
  constructor(private _timetableApiService:TimetableApiService) {

  }

  // Methods
  protected GetStudentTimetable() {
    this._timetableApiService.ReadSudentGroupTimetable(this.studentGroupSearch.value).subscribe((res:any) => {
      this.studentTimetable = res;
    });
  }

  protected UpdateEvent() {
    let eventId = "a5bbdc16b4efc0610974b912bd4b56fd4de790f4bdbbd5410e9319d8e203d37c";
    let updatedTimetable = {
      "StudentGroup": "Real Student Group",
      "StaffId": "ABCD1234",
      "RoomNo": "A0005",
      "Staff": {
          "FullName": "John Doe"
      },
      "Room": {
          "Type": "Lecture Hall",
          "Seats": 32
      },
      "StartTime": "9:00",
      "EndTime": "11:00",
      "ModuleCode": "COMP-7134",
      "Module": {
          "Name": "Introduction to Project Management"
      },
      "Day": "Sunday"
  };

    this._timetableApiService.UpdateEvent(updatedTimetable, eventId).subscribe((res:any) => {
      console.log(res);
    });
  }

  protected DeleteEvent(evntId:string) {
  }
}
