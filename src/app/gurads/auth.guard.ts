import { CanActivateFn, Router } from '@angular/router';
import { LeaveService } from '../shared/services/leave.service';
import { inject } from '@angular/core';
import { AuthServiceService } from '../shared/services/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
  /* const authService = inject(AuthServiceService); // Injection du service Auth
  const router = inject(Router); // Injection du Router

  if (authService.isLoggedIn()) {
    return true; // L'utilisateur est authentifié, on permet l'accès
  } else {
    router.navigate(['/login']); // Redirection vers la page de connexion
    return false; // Refuse l'accès à la route
  } */
};
