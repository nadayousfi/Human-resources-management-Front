import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Leave } from '../shared/classes/leave';
import { LeaveService } from '../shared/services/leave.service';
import { Etat } from '../shared/services/etat.model';
import { UserServiceService } from '../shared/services/user-service.service';
import { LeaveHour } from '../shared/classes/leave-hour';
import { LeaveHourService } from '../shared/services/leave-hour.service';
import { MaladieService } from '../shared/services/maladie.service';
import { Maladie } from '../shared/classes/maladie';

@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrl: './leave-history.component.css',
})
export class LeaveHistoryComponent implements OnChanges {
  @Input() userId!: number; // ID de l'utilisateur sélectionné
  leaveRequests: Leave[] = []; // Liste des demandes de congé
  maladies: Maladie[] = [];
  currentRequest: Leave | null = null; // La demande actuelle en attente
  totalDaysTaken: number = 0; // Total des jours de congé pris
  remainingDays: number = 45; // Jours de congé restants
  userName: string = ''; // Nom de l'utilisateur à afficher
  leaveHourRequestsApproved: LeaveHour[] = [];
  leaveHourRequestsPending: LeaveHour[] = [];
  constructor(
    private leaveService: LeaveService,
    private maladieService: MaladieService,
    private userService: UserServiceService,
    private leaveHourService: LeaveHourService // Service ajouté
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && changes['userId'].currentValue) {
      this.loadUserName(); // Charger le nom de l'utilisateur
      this.loadLeaveHistory();
      this.loadCurrentRequest();
      this.loadLeaveHourHistory();
      this.loadMaladie();
    }
  }

  loadUserName(): void {
    // Récupérer le nom de l'utilisateur par son ID
    this.userService.getUserById(this.userId).subscribe((user) => {
      this.userName = user.name; // Assurez-vous que `user.name` est bien une propriété valide
    });
  }

  loadLeaveHistory(): void {
    this.leaveService.getUserLeaveHistory(this.userId).subscribe((data) => {
      this.leaveRequests = data;
      this.calculateTotalDays(); // Met à jour le total des jours pris
    });
  }
  loadMaladie(): void {
    this.maladieService.getUserMaladieHistory(this.userId).subscribe((data) => {
      this.maladies = data;
    });
  }

  loadCurrentRequest(): void {
    this.leaveService
      .getRequestsByEtat(this.userId, Etat.PENDING)
      .subscribe((data) => {
        this.currentRequest = data.length > 0 ? data[0] : null;
      });
  }
  loadLeaveHourHistory(): void {
    this.leaveHourService.getUserLeaveHistory(this.userId).subscribe((data) => {
      this.leaveHourRequestsApproved = data.filter(
        (hour) => hour.ett == Etat.APPROVED
      );
    });
    this.leaveHourService
      .getRequestsByEtat(this.userId, Etat.PENDING)
      .subscribe((data: LeaveHour[]) => {
        this.leaveHourRequestsPending = data;
      });
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Inclut le jour de début
  }

  calculateTotalDays(): void {
    this.totalDaysTaken = this.leaveRequests.reduce((total, request) => {
      return total + this.calculateDays(request.startDate, request.endDate);
    }, 0);
    this.remainingDays = 45 - this.totalDaysTaken; // Exemple : 45 jours de congé annuels
  }
}
