import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTestEnvComponent } from './api-test-env.component';

describe('ApiTestEnvComponent', () => {
  let component: ApiTestEnvComponent;
  let fixture: ComponentFixture<ApiTestEnvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTestEnvComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiTestEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
