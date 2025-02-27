import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-search-for-timetable',
  standalone: true,
  imports: [RouterOutlet,RouterLink,RouterLinkActive,
    SearchForTimetableComponent
  ],
  templateUrl: './search-for-timetable.component.html',
  styleUrl: './search-for-timetable.component.scss'
})
export class SearchForTimetableComponent {

}
