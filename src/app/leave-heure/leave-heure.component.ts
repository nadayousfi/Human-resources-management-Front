import { Component } from '@angular/core';
import { User } from '../shared/classes/user';
import { LeaveService } from '../shared/services/leave.service';
import { UserServiceService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';
import { LeaveHour } from '../shared/classes/leave-hour';
import { LeaveHourService } from '../shared/services/leave-hour.service';

@Component({
  selector: 'app-leave-heure',
  templateUrl: './leave-heure.component.html',
  styleUrl: './leave-heure.component.css',
})
export class LeaveHeureComponent {
  leaveRequest = {
    hoursRequested: 0,
    startHour: '',
    endHour: '',
    cause: '',
  };
  selectedUserId: number | null = null; // ID de l'utilisateur sélectionné
  users: User[] = []; // Liste des utilisateurs chargés

  constructor(
    private LeaveHour: LeaveHourService,
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
  }

  calculateEndTime(): void {
    if (this.leaveRequest.startHour && this.leaveRequest.hoursRequested > 0) {
      const [hours, minutes] = this.leaveRequest.startHour
        .split(':')
        .map(Number);
      const totalMinutes =
        hours * 60 + minutes + this.leaveRequest.hoursRequested * 60;
      const endHours = Math.floor(totalMinutes / 60) % 24; // Heures modulo 24 pour rester dans la journée
      const endMinutes = totalMinutes % 60;

      // Format de l'heure (HH:MM)
      this.leaveRequest.endHour = `${endHours
        .toString()
        .padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    }
  }

  submitRequest(): void {
    if (this.selectedUserId) {
      console.log('Données envoyées :', this.leaveRequest);

      this.LeaveHour.submitLeaveRequest(
        this.selectedUserId,
        this.leaveRequest
      ).subscribe(
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
