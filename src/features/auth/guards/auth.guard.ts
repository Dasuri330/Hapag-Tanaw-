import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/components/services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to home if not authenticated
  router.navigate(['/404']);
  return false;
};