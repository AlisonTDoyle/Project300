import { Injectable } from '@angular/core';
import fileSaver from 'file-saver';
import { ScheduleTimeBlock } from '../../interfaces/schedule-time-block';

@Injectable({
  providedIn: 'root'
})
export class DatabaseHandlerService {
  // Properties
  private _scheduleFileName:string = "schedule.json"

  constructor() { }

  public SaveTimetableAsFile(scheduleAsString:string): void {
    // Create file
    let fileType:object = {type: "application/json"}
    let scheduleFile:Blob = new Blob([scheduleAsString], fileType);

    fileSaver.saveAs(scheduleFile, this._scheduleFileName);
  }
}
