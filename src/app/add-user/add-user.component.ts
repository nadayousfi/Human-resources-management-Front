import { Component } from '@angular/core';
import { User } from '../shared/classes/user';
import { UserServiceService } from '../shared/services/user-service.service';
import { Router } from '@angular/router';
import { response } from 'express';
import { error } from 'console';
import { HttpClient } from '@angular/common/http';
import { Image } from '../shared/classes/image';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  newUser = {} as User;
  isSubmitting = false;
  uploadedImage!: File;
  imagePath: any;

  constructor(
    private userService: UserServiceService,
    private router: Router
  ) {}
  onImageUpload(event: any) {
    this.uploadedImage = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.uploadedImage);
    reader.onload = (_event) => {
      this.imagePath = reader.result;
    };
  }

  ngOnInit(): void {}
  addUser(): void {
    if (this.isSubmitting) {
      return; // Empêche une deuxième soumission
    }
    this.isSubmitting = true; // Bloque les clics supplémentaires

    this.userService
      .uploadImage(this.uploadedImage, this.uploadedImage.name)
      .subscribe((img: Image) => {
        this.newUser.image = img;

        this.userService.ajouterUser(this.newUser).subscribe(
          (response) => {
            console.log('Utilisateur ajouté avec succès :', response);
            this.router.navigate(['home']);
            this.newUser = {} as User; // Réinitialise le formulaire
            this.isSubmitting = false; // Réactive les clics après succès
          },
          (error) => {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error);
            this.isSubmitting = false; // Réactive les clics après une erreur
          }
        );
      });
  }
}
