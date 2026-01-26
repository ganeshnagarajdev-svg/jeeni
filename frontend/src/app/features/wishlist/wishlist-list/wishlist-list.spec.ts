import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistList } from './wishlist-list';

describe('WishlistList', () => {
  let component: WishlistList;
  let fixture: ComponentFixture<WishlistList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
