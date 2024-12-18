import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LeaveService } from '../shared/services/leave.service';
import { User } from '../shared/classes/user';
import { UserServiceService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrl: './select-user.component.css',
})
export class SelectUserComponent {
  users: { id: number; name: string }[] = []; // Liste des utilisateurs récupérés
  selectedUserId: number | null = null;

  @Output() userSelected = new EventEmitter<number>(); // Événement émis lors de la sélection

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      if (this.users.length > 0) {
        this.selectedUserId = this.users[0].id; // Sélectionne le premier utilisateur
        this.userSelected.emit(this.selectedUserId); // Émet l'ID pour charger l'historique
      }
    });
  }

  onUserSelected(event: Event): void {
    const target = event.target as HTMLSelectElement; // Cast explicite
    const userId = target.value ? parseInt(target.value, 10) : null; // Gestion null-safe
    if (userId) {
      this.selectedUserId = userId;
      this.userSelected.emit(this.selectedUserId);
    }
  }
}
