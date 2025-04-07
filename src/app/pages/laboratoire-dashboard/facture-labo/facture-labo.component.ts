import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facture-labo',
  templateUrl: './facture-labo.component.html',
  styleUrls: ['./facture-labo.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FactureLaboComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  // Méthodes pour la gestion des factures
  creerFacture() {
    // Logique pour créer une nouvelle facture
  }

  rechercherPatient() {
    // Logique pour rechercher un patient
  }
}