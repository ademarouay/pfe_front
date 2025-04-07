import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DemandeService, DemandePlafond } from '../../services/demande.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  selector: 'app-demande-plafond',
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col">
          <h2 class="form-title">Demande de plafond</h2>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">Nouvelle Demande</h5>
            </div>
            <div class="card-body">
              <form #form="ngForm" (ngSubmit)="submitDemande()">
                <div class="mb-3">
                  <h6 class="text-muted">Informations patient</h6>
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label">Nom complet</label>
                      <input type="text" class="form-control" [(ngModel)]="data.patientNom" name="patientNom" required>
                    </div>
                    <div class="col-12">
                      <label class="form-label">CIN</label>
                      <input type="text" class="form-control" [(ngModel)]="data.patientCIN" name="patientCIN" required>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <h6 class="text-muted">Médecin prescripteur</h6>
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label">Nom du médecin</label>
                      <input type="text" class="form-control" [(ngModel)]="data.medecinNom" name="medecinNom" required>
                    </div>
                    <div class="col-12">
                      <label class="form-label">RPPS</label>
                      <input type="text" class="form-control" [(ngModel)]="data.medecinRPPS" name="medecinRPPS" required>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <h6 class="text-muted">Détails de la demande</h6>
                  <div class="mb-3">
                    <label class="form-label">Montant demandé (DH)</label>
                    <input type="number" class="form-control" [(ngModel)]="data.montant" name="montant" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Justification</label>
                    <textarea class="form-control" rows="3" [(ngModel)]="data.justification" name="justification" required></textarea>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">Soumettre la demande</button>
                  <button type="button" class="btn btn-secondary" (click)="resetForm()">Réinitialiser</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="card-title mb-0">Historique des demandes</h5>
            </div>
            <div class="card-body">
              <div class="list-group">
                <div *ngFor="let demande of demandes" class="list-group-item">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{demande.patientNom}}</h6>
                    <small>{{demande.date | date}}</small>
                  </div>
                  <p class="mb-1">Montant: {{demande.montant}} DH</p>
                  <small>Status: {{demande.statut}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-title {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-header {
      border-bottom: none;
    }
    .btn-primary {
      background-color: #3498db;
      border-color: #3498db;
    }
    .btn-primary:hover {
      background-color: #2980b9;
      border-color: #2980b9;
    }
    .list-group-item {
      transition: all 0.2s;
    }
    .list-group-item:hover {
      transform: translateX(5px);
      background-color: #f8f9fa;
    }
  `]
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