import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = async () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.loading()) {
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  if (auth.isAuthenticated) return true;

  router.navigate(['/admin/login']);
  return false;
};
