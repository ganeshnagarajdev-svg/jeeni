import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCareers } from './admin-careers';

describe('AdminCareers', () => {
  let component: AdminCareers;
  let fixture: ComponentFixture<AdminCareers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCareers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCareers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
