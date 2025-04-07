import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from '../../../primeng.module';

@Component({
  selector: 'app-demande-plafond-hopitalisation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeNGModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Demande de Plafond - Hospitalisation</h2>

      <!-- Liste des demandes existantes -->
      <div class="card mb-4">
        <h3 class="text-xl font-semibold mb-3">Demandes existantes</h3>
        <p-table [value]="demandes" [paginator]="true" [rows]="5">
          <ng-template pTemplate="header">
            <tr>
              <th>Patient</th>
              <th>Code CNAM</th>
              <th>Pathologie</th>
              <th>Nombre de séances</th>
              <th>Status</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-demande>
            <tr>
              <td>{{demande.patientName}}</td>
              <td>{{demande.codeCnam}}</td>
              <td>{{demande.pathologie}}</td>
              <td>{{demande.nombreSeances}}</td>
              <td>
                <p-tag [severity]="demande.status === 'Approuvé' ? 'success' : 'warn'">
                  {{demande.status}}
                </p-tag>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
      
      <div class="grid gap-4">
        <!-- Informations du patient -->
        <div class="card">
          <h3 class="text-xl font-semibold mb-3">Informations du patient</h3>
          <div class="p-fluid grid">
            <div class="field col-12 md:col-6">
              <label for="patientName">Nom du patient</label>
              <input pInputText id="patientName" type="text" [(ngModel)]="patientName" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="codeCnam">Code CNAM</label>
              <input pInputText id="codeCnam" type="text" [(ngModel)]="codeCnam" />
            </div>
          </div>
        </div>

        <!-- Détails de la demande -->
        <div class="card">
          <h3 class="text-xl font-semibold mb-3">Détails de la demande</h3>
          <div class="p-fluid">
            <div class="field">
              <label for="pathologie">Pathologie</label>
              <input pInputText id="pathologie" type="text" [(ngModel)]="pathologie" />
            </div>
            <div class="field">
              <label for="nombreSeances">Nombre de séances demandées</label>
              <p-inputNumber id="nombreSeances" [(ngModel)]="nombreSeances" [showButtons]="true" [min]="1" [max]="50"></p-inputNumber>
            </div>
            <div class="field">
              <label for="justification">Justification médicale</label>
              <textarea pInputTextarea id="justification" [(ngModel)]="justification" rows="4"></textarea>
            </div>
            <div class="field">
              <label for="documents">Documents justificatifs</label>
              <p-fileUpload
                mode="basic"
                chooseLabel="Choisir les documents"
                [auto]="true"
                [multiple]="true"
                accept=".pdf,.jpg,.png"
                (onUpload)="onUpload($event)"
              ></p-fileUpload>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2">
          <button pButton label="Annuler" class="p-button-secondary"></button>
          <button pButton label="Soumettre la demande" class="p-button-primary" (click)="submitDemande()"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
  `]
})
export class HopitalisationDemandePlafondComponent implements OnInit {
  patientName: string = '';
  codeCnam: string = '';
  pathologie: string = '';
  nombreSeances: number = 1;
  justification: string = '';
  documents: any[] = [];
  demandes: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // Données de test pour simuler les demandes existantes
    this.demandes = [
      {
        id: 1,
        patientName: 'Jean Dupont',
        codeCnam: 'CNAM123',
        pathologie: 'Lombalgie chronique',
        nombreSeances: 10,
        justification: 'Douleurs persistantes nécessitant une rééducation intensive',
        status: 'En attente'
      },
      {
        id: 2,
        patientName: 'Marie Martin',
        codeCnam: 'CNAM456',
        pathologie: 'Entorse cheville',
        nombreSeances: 8,
        justification: 'Rééducation post-traumatique',
        status: 'Approuvé'
      }
    ];
  }

  onUpload(event: any): void {
    for (let file of event.files) {
      this.documents.push(file);
    }
  }

  submitDemande(): void {
    if (!this.patientName || !this.codeCnam || !this.pathologie || !this.justification) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const nouvelleDemande = {
      id: this.demandes.length + 1,
      patientName: this.patientName,
      codeCnam: this.codeCnam,
      pathologie: this.pathologie,
      nombreSeances: this.nombreSeances,
      justification: this.justification,
      documents: this.documents,
      status: 'En attente'
    };

    this.demandes.push(nouvelleDemande);
    alert('Demande soumise avec succès!');
    
    // Réinitialiser le formulaire
    this.patientName = '';
    this.codeCnam = '';
    this.pathologie = '';
    this.nombreSeances = 1;
    this.justification = '';
    this.documents = [];
  }
}