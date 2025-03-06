import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = "https://fsjvpth2m1.execute-api.eu-west-1.amazonaws.com/dev/search"

  constructor(private http:HttpClient) { }

  searchDB(query:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}?query=${query}`);
  }
}
