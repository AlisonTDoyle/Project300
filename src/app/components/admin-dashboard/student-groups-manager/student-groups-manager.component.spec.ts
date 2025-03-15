import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGroupsManagerComponent } from './student-groups-manager.component';

describe('StudentGroupsManagerComponent', () => {
  let component: StudentGroupsManagerComponent;
  let fixture: ComponentFixture<StudentGroupsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentGroupsManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentGroupsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
