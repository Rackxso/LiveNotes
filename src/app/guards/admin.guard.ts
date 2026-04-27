import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminService } from '../services/admin.service';

export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const admin  = inject(AdminService);
  const router = inject(Router);

  if (auth.isAdmin() && admin.showAdminUI()) return true;
  return router.createUrlTree(['/']);
};
