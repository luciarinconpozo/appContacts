import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanMatchFn = (route, segments) => {
  console.log('Guardián')
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if (authService.isLogged()){
    return true;
  }
  else{
    router.navigateByUrl('/login');
    return false;
  }
};
