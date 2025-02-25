import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManagementFormComponent } from './event-management-form.component';

describe('EventManagementFormComponent', () => {
  let component: EventManagementFormComponent;
  let fixture: ComponentFixture<EventManagementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventManagementFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
