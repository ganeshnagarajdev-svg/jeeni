import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { StorageKeys } from '../constants/storage-keys';

describe('AuthService (Fix Verification)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should handle error in fetchCurrentUser and stop loading', () => {
    localStorage.setItem(StorageKeys.TOKEN, 'fake-token');
    
    let isLoading: boolean | undefined;
    service.isLoading$.subscribe(val => isLoading = val);

    service.fetchCurrentUser().subscribe(user => {
      expect(user).toBeNull();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/me`);
    expect(req.request.method).toBe('GET');
    
    // Simulate 401 error
    req.flush('Invalid token', { status: 401, statusText: 'Unauthorized' });

    expect(isLoading).toBeFalse();
  });
});
