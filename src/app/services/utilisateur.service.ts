import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8081/api/utilisateurs';

  constructor(private http: HttpClient) { }

  // Get user by email
  getUserByEmail(email: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/find/${email}`);
  }

  // Create new user
  createUser(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/create`, utilisateur);
  }

  // Get current user
  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/current`);
  }

  // Update user
  updateUser(updatedUser: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/update`, updatedUser);
  }
}