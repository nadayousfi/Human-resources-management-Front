import { Component } from '@angular/core';
import { User } from '../shared/classes/user';
import { UserServiceService } from '../shared/services/user-service.service';
import { log } from 'console';
import { Image } from '../shared/classes/image';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  user: User[] = [];
  UserPagines: User[] = [];
  page: number = 1;
  pageSize: number = 5;
  constructor(private userService: UserServiceService) {}
  ngOnInit(): void {
    this.chargerUsers();
  }
  chargerUsers() {
    this.userService.getUsers().subscribe((usr) => {
      console.log(usr);
      this.user = usr;
      this.user.forEach((prod) => {
        this.userService
          .loadImage(prod.image.idImage)
          .subscribe((img: Image) => {
            prod.imageStr = 'data:' + img.type + ';base64,' + img.image;
          });
      });
      this.miseAJourPaginess();
    });
  }
  nombreDePages(): number {
    return Math.ceil(this.user.length / this.pageSize);
  }
  miseAJourPaginess(): void {
    const debut = (this.page - 1) * this.pageSize;
    const fin = debut + this.pageSize;
    this.UserPagines = this.user.slice(debut, fin);
  }
  pageSuivante(): void {
    if (this.page < this.nombreDePages()) {
      this.page++;
      this.miseAJourPaginess();
    }
  }
  pagePrecente(): void {
    if (this.page > 1) {
      this.page--;
      this.miseAJourPaginess();
    }
  }
  imprimerLigne(user: User): void {
    const contenu = `
  <table border="1">
  <tr><th>الاسم و اللقب</th><td>${user.name} </td></tr>
 <tr> <th>المصلحة </th><td>${user.adresse}</td></tr>
 <tr> <th>العنوان </th><td>${user.email}</td></tr>
  <tr><th>المعرف الوحيد </th><td>${user.cnr}</td></tr>
 <tr> <th>الرتبة </th><td>${user.role}</td></tr>
  `;
    const popup = window.open('', '_blank', 'width=600,height=400');
    popup?.document.write(`<html><body>${contenu}</body></html>`);
    popup?.document.close();
    popup?.print();
  }
}
