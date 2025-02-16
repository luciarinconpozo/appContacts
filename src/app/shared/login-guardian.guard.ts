import { CanMatchFn } from '@angular/router';

export const loginGuardianGuard: CanMatchFn = (route, segments) => {
  return true;
};
