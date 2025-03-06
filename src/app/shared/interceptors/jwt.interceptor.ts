import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log(req)
  if (token) {
    req = req.clone({
      setHeaders: { "Authorization": `Bearer ${token}`}
    })
  }
  console.log(req)
  return next(req);
};
