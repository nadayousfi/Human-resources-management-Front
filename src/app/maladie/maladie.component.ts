import { Component } from '@angular/core';
import { User } from '../shared/classes/user';
import { MaladieService } from '../shared/services/maladie.service';
import { UserServiceService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';
import { subscribe } from 'diagnostics_channel';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-maladie',
  templateUrl: './maladie.component.html',
  styleUrl: './maladie.component.css',
})
export class MaladieComponent {
  maladie = {
    daysRequested: 0,
    startDate: '',
    endDate: '',
  };
  selectedUserId: number | null = null; // ID de l'utilisateur sélectionné
  users: User[] = []; // Liste des utilisateurs chargés
  constructor(
    private maladieService: MaladieService,
    private userService: UserServiceService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      if (this.users.length > 0) {
        this.selectedUserId = this.users[0].id;
      }
    });
  }
  onUserSelected(): void {
    console.log('utilisateur selectionné:', this.selectedUserId);
  }
  calculatedEndDate(): void {
    if (this.maladie.startDate && this.maladie.daysRequested > 0) {
      const startDate = new Date(this.maladie.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + this.maladie.daysRequested - 1);
      this.maladie.endDate = endDate.toISOString().split('T')[0];
    }
  }
  submitMaladie(): void {
    if (this.selectedUserId) {
      this.maladieService
        .submitMaladie(this.selectedUserId, this.maladie)
        .subscribe(
          (response) => {
            alert('Maladie envoyée avec succés');
            this.router.navigate(['select-user']);
          },
          (error) => {
            console.log('erreur lors de la sousmission');
          }
        );
    } else {
      alert('Veillez selectionner un user avant de soumettre');
    }
  }
}
