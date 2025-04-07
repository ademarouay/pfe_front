import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class PatientListComponent {
  patients = [
    { nom: 'Dupont', prenom: 'Jean', traitement: 'Rééducation post-op' },
    { nom: 'Martin', prenom: 'Sophie', traitement: 'Lombalgie chronique' }
  ];
}