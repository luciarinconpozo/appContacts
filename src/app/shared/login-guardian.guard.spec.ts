import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { loginGuardianGuard } from './login-guardian.guard';

describe('loginGuardianGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginGuardianGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
