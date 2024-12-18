import { Component } from '@angular/core';
import { LeaveService } from '../shared/services/leave.service';
import { User } from '../shared/classes/user';
import { UserServiceService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css',
})
export class LeaveRequestComponent {
  leaveRequest = {
    daysRequested: 0,
    startDate: '',
    endDate: '',
  };
  selectedUserId: number | null = null; // ID de l'utilisateur sélectionné
  users: User[] = []; // Liste des utilisateurs chargés

  constructor(
    private leaveService: LeaveService,
    private userService: UserServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers(); // Charge la liste des utilisateurs au démarrage
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      if (this.users.length > 0) {
        this.selectedUserId = this.users[0].id; // Par défaut, le premier utilisateur
      }
    });
  }

  onUserSelected(): void {
    console.log('Utilisateur sélectionné :', this.selectedUserId);
    // Ici, tu peux ajouter des actions supplémentaires si nécessaire
  }

  calculateEndDate(): void {
    if (this.leaveRequest.startDate && this.leaveRequest.daysRequested > 0) {
      const startDate = new Date(this.leaveRequest.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(
        startDate.getDate() + this.leaveRequest.daysRequested - 1
      );
      this.leaveRequest.endDate = endDate.toISOString().split('T')[0];
    }
  }

  submitRequest(): void {
    if (this.selectedUserId) {
      this.leaveService
        .submitLeaveRequest(this.selectedUserId, this.leaveRequest)
        .subscribe(
          (response) => {
            alert('Demande envoyée avec succès.');
            this.router.navigate(['select-user']);
          },
          (error) => {
            console.error(error);
            alert('Erreur lors de la soumission de la demande.');
          }
        );
    } else {
      alert('Veuillez sélectionner un utilisateur avant de soumettre.');
    }
  }
}
