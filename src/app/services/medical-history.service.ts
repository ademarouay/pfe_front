import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MedicalHistory } from '../models/medical-history';

@Injectable({
  providedIn: 'root'
})

export class MedicalHistoryService {
  getHistory(): Observable<MedicalHistory[]> {
    return of([]); // Implémentation temporaire
  }
  getRecentMedicalHistory(patientId: number) {
    // Mock data - replace with actual API call
    return of([
      { date: '2024-03-15', diagnosis: 'Lombalgie aiguë', treatment: 'Kinésithérapie', doctorName: 'Dr. Dupont', facility: 'Clinique du dos' },
      { date: '2024-03-10', diagnosis: 'Entorse cervicale', treatment: 'Thérapie manuelle', doctorName: 'Dr. Martin', facility: 'Centre de kiné' }
    ]);
  }
}