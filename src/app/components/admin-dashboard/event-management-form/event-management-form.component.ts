import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimetableApiService } from '../../../services/timetable-api/timetable-api.service';
import { Days } from '../../../enum/days';
import { StudentGroup } from '../../../interfaces/student-group';
import { EventVerificationResponse } from '../../../interfaces/request-responses/event-verification-response';
import { CommonModule } from '@angular/common';
import { DatabaseApiService } from '../../../services/database-api/database-api.service';
import { Room } from '../../../interfaces/room';
import { PaginatedRoomResponse } from '../../../interfaces/request-responses/paginated-room-response';
import { EventApi } from '@fullcalendar/core';
import { Staff } from '../../../interfaces/staff';

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
  @Input() studentGroup: StudentGroup | null = null;
  @Input() staffMember: Staff | null = null;
  @Input() roomNumber: Room | null = null;
  @Input() event: EventApi | null = null;

  @Output() eventCreated = new EventEmitter();

  // Properties
  protected eventForm: FormGroup = new FormGroup({
    StartTime: new FormControl('', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]),
    EndTime: new FormControl('', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]),
    Day: new FormControl('Select Day...', [Validators.required]),
    Semester: new FormControl('', [Validators.required]),
    ModuleCode: new FormControl('', [Validators.required]),
    StudentGroup: new FormControl('', [Validators.required]),
    StaffId: new FormControl('', [Validators.required]),
    RoomNo: new FormControl('', [Validators.required]),
  });

  protected showStudentGroupField: boolean = true;
  protected showStaffIdField: boolean = true;
  protected showRoomNoField: boolean = true;
  protected eventConflicts: string[] | undefined = [];
  protected studentGroups: StudentGroup[] = [];
  protected rooms: Room[] = [];
  protected modules: string[] = [];

  // Constructor
  constructor(private _timetableApiService: TimetableApiService, private _databaseApiService: DatabaseApiService) {
    this.eventForm.setValue({
      StartTime: '09:00',
      EndTime: '10:00',
      Day: 'Select Day...',
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
  protected onSubmit(buttonClicked:string) {
    if (buttonClicked == 'update') {
      this.UpdateEvent();
    } else if (buttonClicked == 'create') {
      this.CreateNewEvent();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // hide form with values passed
    this.showStudentGroupField = this.studentGroup == null ? true : false
    this.showStaffIdField = this.staffMember == null ? true : false
    this.showRoomNoField = this.roomNumber == null ? true : false

    if (this.event != null) {
      this.eventForm.patchValue({
        StartTime: this.ConvertMillisecondsSinceEpochToTimeStamp(this.event.start?.getTime()),
        EndTime: this.ConvertMillisecondsSinceEpochToTimeStamp(this.event.end?.getTime()),
        Day: this.event.start ? Days[this.event.start.getDay() as unknown as keyof typeof Days] : 'Select Day...',
        Semester: 'Winter',
        ModuleCode: this.event.title.split(" - ")[0],
        StudentGroup: this.studentGroup?.StudentGroup,
        StaffId: this.event.extendedProps['staffId'],
        RoomNo: this.event.extendedProps['roomNumber']
      });
    } else {
      // fill in form with passed details
      this.eventForm.setValue({
        StartTime: '09:00',
        EndTime: '10:00',
        Day: 'Select Day...',
        Semester: 'Winter',
        ModuleCode: '',
        StudentGroup: this.studentGroup?.StudentGroup || '',
        StaffId: this.staffMember?.StaffId || '',
        RoomNo: this.roomNumber?.RoomNo || ''
      });
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
      Day: [Days[this.eventForm.value.Day as keyof typeof Days]],
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
    this._timetableApiService.VerifyEventExistance(newEvent).subscribe((res: EventVerificationResponse) => {
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

  private ConvertMillisecondsSinceEpochToTimeStamp(duration: number | undefined): string {
    // Method from: https://stackoverflow.com/a/19700358
    if (duration != undefined) {
      let seconds: number = Math.floor((duration / 1000) % 60);
      let minutes: number = Math.floor((duration / (1000 * 60)) % 60);
      let hours: number = Math.floor((duration / (1000 * 60 * 60)) % 24);

      let hoursAsString: string | number = (hours < 10) ? "0" + hours : hours;
      let minutesAsString: string | number = (minutes < 10) ? "0" + minutes : minutes;
      let secondsAsString: string | number = (seconds < 10) ? "0" + seconds : seconds;

      return hoursAsString + ":" + minutesAsString;
    } else {
      return "";
    }
  }

  protected ClearForm() {
    this.event = null;

    this.eventForm.setValue({
      StartTime: '09:00',
      EndTime: '10:00',
      Day: 'Select Day...',
      Semester: 'Winter',
      ModuleCode: '',
      StudentGroup: '',
      StaffId: '',
      RoomNo: ''
    });
  }

  private UpdateEvent() {
    let updatedEvent = {
      _id: this.event?.id,
      Day: [Days[this.eventForm.value.Day as keyof typeof Days]],
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

    if (updatedEvent._id != undefined) {
      this._timetableApiService.UpdateEvent(updatedEvent, updatedEvent._id).subscribe(() => {
        this.eventCreated.emit();
      })
    }
  }

  // Form fields
  get startTime() {
    return this.eventForm.get('StartTime');
  }

  get endTime() {
    return this.eventForm.get('EndTime');
  }

  get day() {
    return this.eventForm.get('Day');
  }

  get semester() {
    return this.eventForm.get('Semester');
  }

  get moduleCode() {
    return this.eventForm.get('ModuleCode');
  }

  get studentGroupField() {
    return this.eventForm.get('StudentGroup');
  }

  get staffId() {
    return this.eventForm.get('StaffId');
  }

  get roomNo() {
    return this.eventForm.get('RoomNo');
  }
}
