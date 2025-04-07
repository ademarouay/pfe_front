import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PatientRights {
  patientId: number;
  annualCeiling: number;
  consumedAmount: number;
  remainingAmount: number;
  lastUpdate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RightsService {
  private apiUrl = '/api/rights';

  constructor(private http: HttpClient) {}

  getPatientRights(patientId: number): Observable<PatientRights> {
    return this.http.get<PatientRights>(`${this.apiUrl}/${patientId}`);
  }

  calculateAnnualCeiling(patientId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${patientId}/ceiling`);
  }

  updateConsumption(patientId: number, amount: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${patientId}/consumption`, { amount });
  }
}