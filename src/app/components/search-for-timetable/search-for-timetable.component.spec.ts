import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForTimetableComponent } from './search-for-timetable.component';

describe('SearchForTimetableComponent', () => {
  let component: SearchForTimetableComponent;
  let fixture: ComponentFixture<SearchForTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForTimetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
