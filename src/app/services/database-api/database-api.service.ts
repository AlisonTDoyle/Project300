import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Room } from '../../interfaces/room';
import { PaginatedRoomResponse } from '../../interfaces/paginated-room-response';

@Injectable({
  providedIn: 'root'
})
export class DatabaseApiService {
  // Properties
  private _apiUrl: string = "https://fsjvpth2m1.execute-api.eu-west-1.amazonaws.com/dev/database";
  private _roomApiUrl: string = `${this._apiUrl}/room`;

  // Constructor
  constructor(private _http: HttpClient) { }

  // Methods
  // Create

  // Read
  public ReadRoomsWithPagination(pageSize: Number, cursor: Object): Observable<PaginatedRoomResponse> {
    // Variables
    let roomQueryUrl = this._roomApiUrl + "/query";
    let queryBody = {
      "pageSize": pageSize,
      "cursor": cursor
    }

    // Request
    return this._http.post<PaginatedRoomResponse>(roomQueryUrl, queryBody).pipe(
      tap((res) => {
        console.log(res);
      })
    );
  }

  // Update

  // Delete
}
