import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageViewer } from './page-viewer';

describe('PageViewer', () => {
  let component: PageViewer;
  let fixture: ComponentFixture<PageViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
