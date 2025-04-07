import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DemandeService, DemandePlafond } from '../../../services/demande.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-demande-plafond',
  templateUrl: './demande-plafond.component.html',
  styleUrls: ['./demande-plafond.component.css']
})
export class DemandePlafondComponent implements OnInit {
  data: any = {
    patientNom: '',
    patientCIN: '',
    medecinNom: '',
    medecinRPPS: '',
    montant: 0,
    justification: ''
  };

  demandes: DemandePlafond[] = [];

  constructor(private demandeService: DemandeService) {}

  ngOnInit() {
    this.demandeService.getDemandes().subscribe(demandes => {
      this.demandes = demandes;
    });
  }

  submitDemande() {
    this.demandeService.ajouterDemande(this.data);
    this.resetForm();
  }

  resetForm() {
    this.data = {
      patientNom: '',
      patientCIN: '',
      medecinNom: '',
      medecinRPPS: '',
      montant: 0,
      justification: ''
    };
  }
}