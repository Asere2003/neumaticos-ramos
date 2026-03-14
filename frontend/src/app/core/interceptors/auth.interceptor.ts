import { from, switchMap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (!req.url.includes('/api/')) return next(req);

  return from(auth.getToken()).pipe(
    switchMap(token => {
      if (!token) return next(req);
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    })
  );
};
