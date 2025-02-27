import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { co } from '@fullcalendar/core/internal-common';
import { catchError, Observable, tap } from 'rxjs';

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
  public CreateEvent(event:any):Observable<any> {
    return this._http.post(this._apiUrl, event).pipe();
  }

  public BatchCreateEvents(events:any[]) {
    let batchCreateUrl:string = `${this._apiUrl}/batch`;

     this._http.post(batchCreateUrl, events).subscribe((res) => {
       return res;
     });
  }

  // Read
  public ReadSudentGroupTimetable(studentGroupId: string):any {
    let fetchUrl:string = `${this._apiUrl}?filter=StudentGroup&id=${studentGroupId}`;

    return this._http.get<any>(fetchUrl).pipe();
  }

  public ReadStaffTimetable(staffId:string):any {
    let fetchUrl:string = `${this._apiUrl}?filter=StaffId&id=${staffId}`;

    return this._http.get<any>(fetchUrl).pipe();
  }

  public ReadRoomTimetable(roomNo:string) {
    let fetchUrl:string = `${this._apiUrl}?filter=RoomNo&id=${roomNo}`;

    return this._http.get<any>(fetchUrl).pipe();
  }

  // Update
  public UpdateEvent(event:any, eventId:string) {
    let updateUrl:string = `${this._apiUrl}/${eventId}`;

    return this._http.put(updateUrl, event).pipe();
  }

  // Delete
  public DeleteEvent(eventId:string) {
    let deleteUrl:string = `${this._apiUrl}/${eventId}`;

    return this._http.delete(deleteUrl).pipe();
  }
}
