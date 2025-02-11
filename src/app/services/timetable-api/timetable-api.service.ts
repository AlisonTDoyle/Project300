import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimetableApiService {
  // Properties
  private _apiUrl:string = "https://fsjvpth2m1.execute-api.eu-west-1.amazonaws.com/dev/timetable-events";

  // Constructor
  constructor(private _http:HttpClient) {

  }

  // Methods
  // Create
  public CreateEvent(event:any) {
    this._http.post(this._apiUrl, event).subscribe((res) => {
      return res;
    });
  }

  // Read
  public ReadSudentGroupTimetable(studentGroupId: string) {
    let fetchUrl:string = `${this._apiUrl}?filter=StudentGroup&id=${studentGroupId}`;

    this._http.get(fetchUrl).subscribe((res) => {
      return res;
    });
  }

  public ReadStaffTimetable(staffId:string) {
    let fetchUrl:string = `${this._apiUrl}?filter=StaffId&id=${staffId}`;

    this._http.get(fetchUrl).subscribe((res) => {
      return res;
    });
  }

  public ReadRoomTimetable(roomNo:string) {
    let fetchUrl:string = `${this._apiUrl}?filter=RoomNo&id=${roomNo}`;

    this._http.get(fetchUrl).subscribe((res) => {
      return res;
    });
  }

  // Update

  // Delete
}
