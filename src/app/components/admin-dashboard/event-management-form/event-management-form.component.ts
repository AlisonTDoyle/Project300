import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimetableApiService } from '../../../services/timetable-api/timetable-api.service';
import { Days } from '../../../enum/days';
import { StudentGroup } from '../../../interfaces/student-group';

@Component({
  selector: 'app-event-management-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './event-management-form.component.html',
  styleUrl: './event-management-form.component.scss'
})
export class EventManagementFormComponent {
  // Inputs and outputs
  @Input() studentGroup: StudentGroup|null = null;
  @Input() staffMember: string = '';
  @Input() roomNumber: string = '';

  @Output() eventCreated = new EventEmitter();

  // Properties
  protected eventForm: FormGroup = new FormGroup({
    StartTime: new FormControl(''),
    EndTime: new FormControl(''),
    Day: new FormControl(''),
    Semester: new FormControl(''),
    ModuleCode: new FormControl(''),
    StudentGroup: new FormControl(''),
    StaffId: new FormControl(''),
    RoomNo: new FormControl(''),
  });

  // Constructor
  constructor(private _timetableApiService: TimetableApiService) {
    this.eventForm.setValue({
      StartTime: '09:00',
      EndTime: '10:00',
      Day: 'Monday',
      Semester: 'Winter',
      ModuleCode: '',
      StudentGroup: this.studentGroup == null ? '' : this.studentGroup.StudentGroup,
      StaffId: '',
      RoomNo: ''
    });
  }

  // Event handlers
  protected onSubmit() {
    let newEvent = {
      Day:[ Days[this.eventForm.value.Day as keyof typeof Days]],
      EndTime: this.eventForm.value.EndTime || "13:00",
      Module: { Name: { S: this.eventForm.value.ModuleName || "Database Programming" } },
      ModuleCode: this.eventForm.value.ModuleCode || "COMP-7176",
      Room: { Type: { S: this.eventForm.value.RoomType || "Tiered Classroom" }, Seats: { N: this.eventForm.value.RoomSeats || "100" } },
      RoomNo: this.eventForm.value.RoomNo || "D1001",
      Semester: this.eventForm.value.Semester || null,
      Staff: { FullName: { S: this.eventForm.value.StaffFullName || "John Doe" } },
      StaffId: this.eventForm.value.StaffId || "ABCD1234",
      StartTime: this.eventForm.value.StartTime || "11:00",
      StudentGroup: this.eventForm.value.StudentGroup || "SG_KSODV_H08/F/Y3/1/(A)"
    };

    this._timetableApiService.CreateEvent(newEvent).subscribe((res) => {
      this.eventCreated.emit(res);
    });
  }

  // Methods
}
