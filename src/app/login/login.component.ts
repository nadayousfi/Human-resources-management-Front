import { Component } from '@angular/core';
import { AuthServiceService } from '../shared/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  login(): void {
    this.authService.setAuthenticated(true);
    this.router.navigate(['/home']);
    /* this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.setAuthenticated(true);
        this.router.navigate(['/home']); // Redirection après connexion
      },
      (error) => {
        this.errorMessage = 'Identifiants incorrects ou serveur indisponible.';
      }
    ); */
  }
}
