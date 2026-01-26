import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersList } from './careers-list';

describe('CareersList', () => {
  let component: CareersList;
  let fixture: ComponentFixture<CareersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareersList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
