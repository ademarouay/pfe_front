import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  loadingError: boolean = false;
  isLoading: boolean = true; // Initialize to true
  profileFields: Array<{ key: keyof Utilisateur, label: string, type: string }> = [
    { key: 'nom', label: 'Nom', type: 'text' },
    { key: 'prenom', label: 'Prénom', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'numeroTelephone', label: 'Téléphone', type: 'tel' },
    { key: 'adresse', label: 'Adresse', type: 'text' },
    { key: 'codeCnam', label: 'Code CNAM', type: 'text' }, // Add codeCnam
  ];
  currentUser: Utilisateur | null = null;
  isEditing = false;
  editForm: Partial<Utilisateur> = {
    nom: '',
    prenom: '',
    email: '',
    numeroTelephone: '',
    adresse: '',
    codeCnam: 0, // Add codeCnam
  };
  formErrors: { [key: string]: string } = {};

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true; // Set isLoading to true before loading
    this.utilisateurService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.editForm = { ...user };
        this.isLoading = false; // Set isLoading to false after successful load
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.loadingError = true;
        this.isLoading = false; // Set isLoading to false on error
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editForm = { ...this.currentUser };
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    if (!this.editForm.nom) this.formErrors['nom'] = 'Le nom est requis';
    if (!this.editForm.email) this.formErrors['email'] = 'L\'email est requis';
    if (!this.editForm.numeroTelephone) this.formErrors['numeroTelephone'] = 'Le téléphone est requis'; // Correct the error key
    if (this.editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editForm.email)) {
      this.formErrors['email'] = 'Format d\'email invalide';
    }
    return Object.keys(this.formErrors).length === 0;
  }

  saveProfile(): void {
    if (!this.validateForm()) return;

    if (this.currentUser?.id) {
      this.utilisateurService
        .updateUser({ id: this.currentUser.id, ...this.editForm })
        .subscribe({
          next: (updatedUser) => {
            this.currentUser = updatedUser;
            this.isEditing = false;
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.formErrors['general'] = 'Une erreur est survenue lors de la mise à jour du profil';
          },
        });
    }
  }
}