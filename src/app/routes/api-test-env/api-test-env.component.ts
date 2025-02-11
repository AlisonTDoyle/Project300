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
  protected studentGroup:FormControl = new FormControl('');
  protected staffId:FormControl = new FormControl('');
  protected roomNo:FormControl = new FormControl('');

  protected studentTimetable:any = [];
  protected staffTimetable:any = [];
  protected roomTimetable:any = [];

  // Constructor
  constructor(private _timetableApiService:TimetableApiService) {

  }

  // Methods
  protected GetStudentTimetable() {
    this.studentTimetable = this._timetableApiService.ReadSudentGroupTimetable(this.studentGroup.value);
  }
}
