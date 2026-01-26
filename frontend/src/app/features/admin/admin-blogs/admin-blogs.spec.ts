import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBlogs } from './admin-blogs';

describe('AdminBlogs', () => {
  let component: AdminBlogs;
  let fixture: ComponentFixture<AdminBlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBlogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
