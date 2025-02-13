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
  protected async GetStudentTimetable() {
    this._timetableApiService.ReadSudentGroupTimetable(this.studentGroupSearch.value).subscribe((res:any) => {
      this.studentTimetable = res;
    });
  }
}
