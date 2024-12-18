import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../classes/user';
import { url } from 'inspector';
import { Image } from '../classes/image';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8080/api/users'; // Remplacez par l'URL correcte
  private apiurl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs depuis le backend
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<User>(url);
  }
  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`;
    return this.http.put<User>(url, user);
  }
  ajouterUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  uploadImage(file: File, filename: string): Observable<Image> {
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${this.apiurl + '/image/upload'}`;
    return this.http.post<Image>(url, imageFormData);
  }
  loadImage(id: number): Observable<Image> {
    const url = `${this.apiurl + '/image/get/info'}/${id}`;
    return this.http.get<Image>(url);
  }
}
