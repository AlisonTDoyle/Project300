import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TimetableApiService } from '../../../services/timetable-api/timetable-api.service';
import { Days } from '../../../enum/days';
import { StudentGroup } from '../../../interfaces/student-group';
import { EventVerificationResponse } from '../../../interfaces/request-responses/event-verification-response';
import { CommonModule } from '@angular/common';
import { DatabaseApiService } from '../../../services/database-api/database-api.service';
import { Room } from '../../../interfaces/room';
import { PaginatedRoomResponse } from '../../../interfaces/request-responses/paginated-room-response';

@Component({
  selector: 'app-event-management-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './event-management-form.component.html',
  styleUrl: './event-management-form.component.scss'
})
export class EventManagementFormComponent implements OnChanges {
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

  protected showStudentGroupField:boolean = true;
  protected showStaffIdField:boolean = true;
  protected showRoomNoField:boolean = true;
  protected eventConflicts:string[]|undefined = [];
  protected studentGroups:StudentGroup[] = [];
  protected rooms:Room[] = [];
  protected modules:string[] = [];

  // Constructor
  constructor(private _timetableApiService: TimetableApiService, private _databaseApiService:DatabaseApiService) {
    this.eventForm.setValue({
      StartTime: '09:00',
      EndTime: '10:00',
      Day: 'Monday',
      Semester: 'Winter',
      ModuleCode: '',
      StudentGroup: '',
      StaffId: '',
      RoomNo: ''
    });

    this.FetchRooms();
    this.FetchStudentGroups();
  }

  // Event handlers
  protected onSubmit() {
    this.CreateNewEvent();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['StudentGroup'] && this.studentGroup) {
      this.eventForm.patchValue({ StudentGroup: this.studentGroup.StudentGroup });
      this.showStudentGroupField = false;
    }
    if (changes['staffMember'] && this.staffMember !== '') {
      this.showStaffIdField = false;
    }
    if (changes['roomNumber'] && this.roomNumber !== '') {
      this.showRoomNoField = false;
    }
  }

  // Methods
  private FetchRooms() {
    this._databaseApiService.ReadRoomsWithPagination(20, {}).subscribe((res) => {
      this.rooms = res.rooms;
    });
  }

  private FetchStudentGroups() {
    this._databaseApiService.ReadStudentGroupsWithPagination(20, {}).subscribe((res) => {
      this.studentGroups = res.studentGroups;
    });
  }

  // private FetchModules() {
  //   this._databaseApiService.ReadRoomsWithPagination(20, {}).subscribe((res) => {
  //     this.rooms = res.rooms;
  //   });
  // }

  private CreateNewEvent() {
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

    // Check if event exists
    let eventExists: boolean | undefined = false;
    this._timetableApiService.VerifyEventExistance(newEvent).subscribe((res:EventVerificationResponse) => {
      console.log(res)
      
      eventExists = res.ConflictExists;
      this.eventConflicts = (res.Conflicts?.length ?? 0) >= 1 ? res.Conflicts : [];

      // Create event
      if (this.eventConflicts && this.eventConflicts.length == 0) {
        console.log("hello")
        this._timetableApiService.CreateEvent(newEvent).subscribe((res) => {
          this.eventCreated.emit();
        });
      }
    });
  }
}
