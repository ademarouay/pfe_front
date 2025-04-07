import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DemandePlafond {
date: string|number|Date;
  id: string;
  patientNom: string;
  patientCIN: string;
  medecinNom: string;
  medecinRPPS: string;
  montant: number;
  justification: string;
  dateCreation: Date;
  statut: 'En attente' | 'Approuvée' | 'Refusée';
}

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private demandes: DemandePlafond[] = [];
  private demandesSubject = new BehaviorSubject<DemandePlafond[]>([]);

  constructor() {
    // Initialiser avec des données de test
    this.demandes = [
      {
        id: '1',
        date: new Date(),
        patientNom: 'Test Patient',
        patientCIN: 'AB123456',
        medecinNom: 'Dr. Test',
        medecinRPPS: 'RPPS123',
        montant: 5000,
        justification: 'Traitement urgent',
        dateCreation: new Date(),
        statut: 'En attente'
      }
    ];
    this.demandesSubject.next(this.demandes);
  }

  getDemandes(): Observable<DemandePlafond[]> {
    return this.demandesSubject.asObservable();
  }

  ajouterDemande(demande: Omit<DemandePlafond, 'id' | 'dateCreation' | 'statut'>): void {
    const nouvelleDemande: DemandePlafond = {
      ...demande,
      id: Date.now().toString(),
      dateCreation: new Date(),
      statut: 'En attente'
    };
    this.demandes.push(nouvelleDemande);
    this.demandesSubject.next(this.demandes);
  }

  updateStatut(id: string, statut: DemandePlafond['statut']): void {
    const index = this.demandes.findIndex(d => d.id === id);
    if (index !== -1) {
      this.demandes[index] = {
        ...this.demandes[index],
        statut
      };
      this.demandesSubject.next(this.demandes);
    }
  }
}