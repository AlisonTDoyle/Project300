import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { co } from '@fullcalendar/core/internal-common';
import { catchError, tap } from 'rxjs';

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
  public ReadSudentGroupTimetable(studentGroupId: string):any {
    let fetchUrl:string = `${this._apiUrl}?filter=StudentGroup&id=${studentGroupId}`;

    this._http.get(fetchUrl).subscribe((res) => {
      console.log(res);
      return res;
    });
  }

  public ReadStaffTimetable(staffId:string):any {
    let fetchUrl:string = `${this._apiUrl}?filter=StaffId&id=${staffId}`;

    return this._http.get<any>(fetchUrl)
    .pipe(
      tap((data) => {
        // Debug message
        console.log('Data: ' + JSON.stringify(data))
      }),
      catchError(this.HandleError)
    );
  }

  public ReadRoomTimetable(roomNo:string) {
    let fetchUrl:string = `${this._apiUrl}?filter=RoomNo&id=${roomNo}`;

    this._http.get(fetchUrl).subscribe((res) => {
      return res;
    });
  }

  // Update

  // Delete

  // Misc.
  private HandleError(err: HttpErrorResponse) {
    console.error('Error: ' + err.message);
    return err.message;
  }
}
