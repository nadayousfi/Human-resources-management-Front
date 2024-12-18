import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../shared/services/leave.service';
import { UserServiceService } from '../shared/services/user-service.service';
import { Etat } from '../shared/services/etat.model';
import { Leave } from '../shared/classes/leave';
import { User } from '../shared/classes/user';
import jsPDF from 'jspdf';
import { LeaveHour } from '../shared/classes/leave-hour';
import { LeaveHourService } from '../shared/services/leave-hour.service';
import { Maladie } from '../shared/classes/maladie';
import { MaladieService } from '../shared/services/maladie.service';
import {
  endOfDay,
  isAfter,
  isBefore,
  isEqual,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';
import { takeUntil } from 'rxjs';
import { log } from 'node:console';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  leaveRequests: Leave[] = [];
  maladies: Maladie[] = [];
  leaveHourRequests: LeaveHour[] = [];
  users: User[] = [];
  usersMap: Map<number, string> = new Map();
  eml: number = 0;
  selectedMonth: number = new Date().getMonth() + 1; // Mois courant
  selectedYear: number = new Date().getFullYear(); // Année courante

  filteredLeaveRequests: Leave[] = [];
  totalEmployees: number = 0;
  employeesSick: Maladie[] = []; // Correction de la propriété
  employeesOnLeave: number = 0;
  emsk: number = 0;
  percentageOnLeave: number = 0;
  months: string[] = [
    'جانفي',
    'فيفري',
    'مارس',
    'أفريل',
    'ماي',
    'جوان',
    'جويلية',
    'أوت',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  today: string = new Date().toLocaleDateString('fr-FR');

  constructor(
    private leaveService: LeaveService,
    private userService: UserServiceService,
    private leaveHourService: LeaveHourService,
    private maladieService: MaladieService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadLeaveRequests();
    this.loadLeaveHourRequests();
    this.calculateLeaveStatistics();
    this.employeeOnSick();
  }

  onMonthChange(): void {
    this.leaveService
      .getLeaveRequestsByMonth(this.selectedMonth) // Ajout de l'année pour éviter des incohérences
      .subscribe((data) => {
        this.leaveRequests = data;
      });

    this.maladieService.getUserByMonth(this.selectedMonth).subscribe((data) => {
      this.maladies = data;
    });
  }

  employeeOnSick(): void {
    this.maladieService.getMaladie().subscribe((maladies) => {
      const today = new Date();
      this.employeesSick = maladies.filter((maladie) => {
        // Conversion des timestamps en objets Date
        const startDate = new Date(maladie.startDate);
        const endDate = new Date(maladie.endDate);

        // Vérification si "today" est dans l'intervalle [startDate, endDate]
        return isWithinInterval(today, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      });

      // Afficher le nombre d'employés malades
      console.log('Employés malades :', this.employeesSick.length);
      this.emsk = this.employeesSick.length;
      console.log(this.emsk);
    });
  }

  calculateEmployeesOnLeave(leaves: Leave[]): void {
    const today = new Date();

    this.employeesOnLeave = leaves.filter((leave) => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);

      return isWithinInterval(today, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      });
    }).length;

    console.log(
      "Nombre d'employés en congé aujourd'hui:",
      this.employeesOnLeave
    );
  }

  calculateLeaveStatistics(): void {
    this.userService.getUsers().subscribe((users) => {
      this.totalEmployees = users.length;

      this.leaveService
        .getLeaveRequestsByEtats(Etat.APPROVED)
        .subscribe((leaveRequests) => {
          this.calculateEmployeesOnLeave(leaveRequests);

          this.percentageOnLeave = Number(
            ((this.employeesOnLeave / this.totalEmployees) * 100).toFixed(2)
          );

          console.log(`Total employés: ${this.totalEmployees}`);
          console.log(`Employés en congé: ${this.employeesOnLeave}`);
          console.log(`Pourcentage en congé: ${this.percentageOnLeave}%`);
        });

      this.employeeOnSick();
    });
  }

  // Charger les utilisateurs et les associer à un userId
  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      users.forEach((user) => {
        this.usersMap.set(user.id, user.name);
      });
      console.log('Map utilisateur après chargement:', this.usersMap);
    });
  }

  // Charger les demandes de congé
  // Charger les demandes de congé
  loadLeaveRequests(): void {
    this.leaveService
      .getLeaveRequestsByEtats(Etat.PENDING)
      .subscribe((leaveRequests) => {
        this.leaveRequests = leaveRequests;
        if (this.users.length === 0) {
          this.loadUsers(); // Charger les utilisateurs si non chargés
        }
      });
  }
  loadLeaveHourRequests(): void {
    this.leaveHourService
      .getLeavRequestsByEtats(Etat.PENDING)
      .subscribe((leaveHourRequests) => {
        this.leaveHourRequests = leaveHourRequests;
      });
  }
  approveLeaveHourRequest(request: LeaveHour): void {
    request.ett = Etat.APPROVED;
    this.leaveHourService.updateLeaveRequest(request).subscribe(() => {
      this.loadLeaveHourRequests();
      this.imprimeleaveh(request);
    });
  }
  rejectLeaveHourRequest(request: LeaveHour): void {
    request.ett = Etat.REJECTED;
    this.leaveHourService.updateLeaveRequest(request).subscribe(() => {
      this.loadLeaveHourRequests();
    });
  }
  // Approuver une demande
  approveRequest(leave: Leave): void {
    leave.ett = Etat.APPROVED; // Mettre l'état de la demande à "APPROVED"
    this.leaveService.updateLeaveRequest(leave).subscribe(() => {
      this.updateLeaveBalance(leave.user.id, leave.startDate, leave.endDate); // Mettre à jour le solde de congé de l'utilisateur
      this.loadLeaveRequests(); // Recharger les demandes de congé
    });
  }

  // Rejeter une demande
  rejectRequest(leave: Leave): void {
    leave.ett = Etat.REJECTED; // Mettre l'état de la demande à "REJECTED"
    this.leaveService.updateLeaveRequest(leave).subscribe(() => {
      this.loadLeaveRequests(); // Recharger les demandes de congé
    });
  }
  supprimerLeave(l: Leave) {
    let conf = confirm('etes vous sur ?');
    if (conf) {
      this.leaveService.supprimerLeave(l.id).subscribe(() => {
        console.log('leave rejeté');
        this.loadLeaveRequests();
      });
    }
  }
  // Calculer le nombre de jours de congé entre deux dates
  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }

  // Mettre à jour le solde de congé de l'utilisateur
  updateLeaveBalance(userId: number, startDate: string, endDate: string): void {
    const daysTaken = this.calculateDays(startDate, endDate);
    this.userService.getUserById(userId).subscribe((user) => {
      this.userService.updateUser(user).subscribe(() => {
        console.log('Solde de congé mis à jour');
      });
    });
  }

  // Obtenir le nom de l'utilisateur par son ID en utilisant la Map
  getUserNameById(userId: number): string {
    console.log(`Recherche du nom pour userId: ${userId}`); // Vérification de la recherche du nom
    return this.usersMap.get(userId) || 'Inconnu';
  }
  approveRequests(leave: Leave): void {
    // Changer l'état à APPROVED
    leave.ett = Etat.APPROVED;
    this.leaveService.updateLeaveRequest(leave).subscribe(() => {
      console.log('etat mis a jour dans la base de donnees');
      this.imprimeleave(leave);

      this.loadLeaveRequests();
    });
  }

  imprimeleave(leave: Leave): void {
    const contenu = `
<style>
              body { font-family: "Arial", sans-serif; line-height: 1.6; direction: rtl; text-align: right; padding: 20px; }
              .input-field { border: none; border-bottom: 1px solid #000; margin: 0 5px; width: 50%; text-align: center; }
              .long-input { width: 80%; }
              h1 { text-align: center; font-size: 24px; text-decoration: underline; }
              .note { font-size: 12px; color: #555; }
              .horizontal-list {
  list-style-type: none; /* Supprime les puces de la liste */
  padding: 0;
  margin: 0;
  display: flex; /* Utilise flexbox pour un alignement horizontal */
  gap: 10px; /* Espace entre les éléments */
}

.horizontal-list li {
  display: flex; /* Assure que chaque élément occupe son espace */
  align-items: center; /* Aligne verticalement les cases à cocher */
}
.input-fieldd {
  text-align: left;
}
  .pp{
  font-size: 20px; font-weight: bold;}
  .section1{
  font-size: 20px; font-weight: bold;}
.header {
  position: absolute; /* Permet de positionner l'élément par rapport à son parent */
  top: 0; /* Aligne l'élément en haut */
  right: 0; /* Aligne l'élément à droite */
  text-align: center; /* Centre les lignes à l'intérieur du div */
}

.header p {
  margin: 1px 0; /* Espace entre les paragraphes */
    line-height: 1; /* Ajuste l'espacement entre les lignes */

}
    .note{
      line-height: 1; /* Réduit l'espace entre les lignes */

    }
            </style>
            <div class="header">
  <p>وزارة الداخلية</p>
  <p>الإدارة العامة للحرس الوطني</p>
  <p>الإدارة العامة للمصالح المشتركة</p>
</div>

    <div class="container">
  <h1>مطلـــب عطلــــة</h1>

  <div class="section">
    <label class="pp"><input type="checkbox" /> عطلة إستراحة سنوية</label><br />
    <label class="pp">
      <input type="checkbox" /> عطلة إستثنائية : موجبها :
      <span class="input-field"></span>
    </label><br />
    <ul class="horizontal-list">
   <li> <label class="pp"><input type="checkbox" /> عطلة لأسباب صحية
   </li> </label>
      <li><label class="pp"><input type="checkbox" /> ولادة</label></li>
      <li><label class="pp"><input type="checkbox" /> أمومة</label></li>
    </ul>
    <label class="pp"><input type="checkbox" /> عطلة تعويضية</label>
  </div>

  <div class="section1">
    <label class="pp">المعـرف الوحيد : ${leave.user.cnr}
    </label>
    <p>الإســـم واللّقــب : <span class="input-field">${leave.user.name}</span></p>
    <p>الرتبة أو الصنف : <span class="input-field">${leave.user.role}</span></p>
    <p>الخطة الوظيفية : <span class="input-field"></span></p>
    <p>الهيكل الإداري : الإدارة الفرعية للمواصلات السلكية واللاسلكية</p>
    <p>المصلحــــــــــة : <span class="long-input">${leave.user.email}</span></p>
    <p>مركز العمـــل : العوينـــــة</p>
  </div>

  <div class="section1">
    <p>
      المدة المطلوبة :${leave.daysRequested}  <span class="input-field"></span>
      من :  ${leave.startDate}<span class="input-field"></span>
      إلى :  ${leave.endDate} <span class="input-field"></span> بعنوان 2024
    </p>
    <p>عنوان مقر السكنى طيلة (3) : <span class="long-input"></span></p>
    <p>الوثائق المصاحبة : <span class="long-input"></span></p>
  </div>

  <div class="signature-section">
    <p style="font-size: 18px; font-weight: bold; text-align: center;">بالعوينة في : ${this.today} <span value="{{today}} class="input-fieldd" ></span></p>
    <p>ملاحظة الرئيس المباشر (4) : <span class="long-input"></span></p>
    <p>
     ............. بـــ : <span class="input-field"></span> 
     ................في
      <span class="input-field"></span>
    </p>
    <div style="font-size: 18px; font-weight: bold; text-align: center;">إمضاء طالب العطلة : <span class="input-fieldd"></span></div>
    <div>الإمضاء والختم : <span class="input-field"></span></div>
    <div>المعوض (ة) : <span class="input-field"></span></div>
  </div>

  <div class="note">
    <p>(4) توضع علامة (x) داخل الخانة المناسبة.</p>
    <p>(5) يرفع المطلب بالوثائق المدعمة.</p>
    <p>(6) إحرص على ذكر عنوان مقر إقامتك وإلا أعتبر الملف ملغى.</p>
    <p>(7) عند الموافقة الرجاء تذكير المعوض.</p>
  </div>
  `;

    const popup = window.open('', '_blank', 'width=600,height=400');
    popup?.document.write(`<html><body>${contenu}</body></html>`);
    popup?.document.close();
    popup?.print();
  }
  imprimeleaveh(leave: LeaveHour): void {
    const contenu = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إسترخاص</title>
    <style>
        body {
            font-family: "Arial", sans-serif;
            line-height: 1.8;
            direction: rtl;
            text-align: right;
            margin: 20px;
        }
        .container {
            border: 1px solid #000;
            padding: 20px;
            width: 80%;
            margin: auto;
        }
        h1, h2 {
            text-align: center;
            font-size: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .input-field {
            border: none;
            margin: 0 5px;
            width: 50%;
            text-align: center;
            display: inline-block;
        }
        .signature {
            margin-top: 30px;
            text-align: left;
        }
        .signature span {
            display: inline-block;
            margin-left: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                الإدارة العامـــة للحرس الوطني<br>
                إدارة الخدمات الفنية<br>
                إ . ف . م . س . و اللاسلكية
            </div>
            <div style="text-align: center;">
                العوينة في : ${this.today} <span class="input-field"></span>
            </div>
        </div>

        <h1>إسترخــــاص</h1>

        <div class="section">
            <p>مـــــن : ${leave.user.name} <span class="input-field"></span></p>
            <p>رقــــم : ${leave.user.cnr}<span class="input-field"></span></p>
        </div>

        <div class="section">
            <p>إلــــى السيــــد :</p>
            <p style="text-indent: 20px;">رئيــس الإدارة الفرعية للمواصلات السلكية و اللاسلكية</p>
        </div>

        <div class="section">
            <p>لمــــــــدة : ${leave.hoursRequested} ساعــة <span class="input-field"></span></p>
            <p>يوم : ${this.today} <span class="input-field"></span></p>
            <p>بدايـــة من الساعـــة : ${leave.startHour} <span class="input-field"></span></p>
            <p>إلـــى الساعــة : ${leave.endHour} <span class="input-field"></span></p>
        </div>

        <div class="section">
            <p>الأسبــاب : ${leave.cause} <span class="input-field" style="width: 80%;"></span></p>
        </div>

        <div class="signature">
            الإمضــــــاء
        </div>
    </div>
</body>
</html>

  `;
    const popup = window.open('', '_blank', 'width=600,height=400');
    popup?.document.write(`<html><body>${contenu}</body></html>`);
    popup?.document.close();
    popup?.print();
  }
  filterByMonth(): void {
    if (this.selectedMonth) {
      this.filteredLeaveRequests = this.leaveRequests.filter((leave) => {
        const startDate = new Date(leave.startDate);
        return startDate.getMonth() + 1 === this.selectedMonth;
      });
    }
  }
  imprimerTout(): void {
    const contenu = `
<style>
  body { font-family: "Arial", sans-serif; direction: rtl; text-align: center; padding: 20px; line-height: 1.6; }
  .header { text-align: center; margin-bottom: 20px; }
  .header p { margin: 0; }

  .header1 {
  position: absolute; /* Permet de positionner l'élément par rapport à son parent */
  top: 0; /* Aligne l'élément en haut */
  right: 0; /* Aligne l'élément à droite */
  text-align: center; /* Centre les lignes à l'intérieur du div */
}

.header1 p {
  margin: 1px 0; /* Espace entre les paragraphes */
    line-height: 1; /* Ajuste l'espacement entre les lignes */

}
  h1 { font-size: 24px; text-decoration: underline; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 20px auto; }
  th, td { border: 1px solid black; padding: 8px; text-align: center; }
  th { background-color: #f2f2f2; }
</style>

<div style="text-align: left;">
  العوينة في : ${this.today}
</div>

<div class="header1" ">
  <p>وزارة الداخلية</p>
  <p>الإدارة العامة للحرس الوطني</p>
  <p>الإدارة العامة للمصالح المشتركة</p>
  </div>
<div class="header" >

  <h1>الإجازات الممنوحة خلال شهر ${this.months[this.selectedMonth - 1]}</h1>
  <p>الخاصة بالضباط , الرتباء و الأعوان</p>
  <p>التابعين للإدارة الفرعية للمواصلات السلكية و اللاسلكية</p>
  </div>


<table>
  <thead>
    <tr>
      <th>ع/ر</th>
      <th>الرقم الشخصي</th>
      <th>الرتبة</th>
      <th>المعرف الوحيد</th>
      <th>الإسم و اللقب</th>
      <th>التعيين</th>
      <th>نوع الإجازة</th>
      <th>مدة الإجازة</th>
      <th>تاريخ البداية</th>
    </tr>
  </thead>
  <tbody>
    ${this.leaveRequests
      .map(
        (leave, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${leave.user.id}</td>
      <td>${leave.user.email}</td>
      <td>${leave.user.cnr}</td>
      <td>${leave.user.name}</td>
      <td>إ.ف.م . س . و اللاسلكية</td>
      <td>سنوية</td>
      <td>${leave.daysRequested} يوم</td>
      <td>${leave.startDate}</td>
    </tr>
    `
      )
      .join('')}
  </tbody>
</table>

<h2>حالات مرض</h2>
<table>
  <thead>
    <tr>
      <th>ع/ر</th>
      <th>الرقم الشخصي</th>
      <th>الرتبة</th>
      <th>المعرف الوحيد</th>
      <th>الإسم و اللقب</th>
      <th>التعيين</th>
      <th>نوع الإجازة</th>
      <th>مدة الإجازة</th>
      <th>تاريخ البداية</th>
    </tr>
  </thead>
  <tbody>
    ${this.maladies
      .map(
        (maladi, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${maladi.user.id}</td>
      <td>${maladi.user.email}</td>
      <td>${maladi.user.cnr}</td>
      <td>${maladi.user.name}</td>
      <td>إ.ف.م . س . و اللاسلكية</td>
      <td>مرض</td>
      <td>${maladi.daysRequested} يوم</td>
      <td>${maladi.startDate}</td>
    </tr>
    `
      )
      .join('')}
  </tbody>
</table>
`;

    const popup = window.open('', '_blank', 'width=800,height=600');
    if (popup) {
      popup.document.write(`<html><body>${contenu}</body></html>`);
      popup.document.close();
      popup.print();
    } else {
      console.error("Impossible d'ouvrir une fenêtre pour imprimer.");
    }
  }
}
