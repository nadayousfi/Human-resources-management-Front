import { Component } from '@angular/core';
import { UserServiceService } from './shared/services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selectedUserId: number | null = null;

  onUserSelected(userId: number): void {
    this.selectedUserId = userId; // Met à jour l'utilisateur sélectionné
  }
}
