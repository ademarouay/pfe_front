import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PriorAuthorization {
  id: number;
  patientId: number;
  prescriptionId: number;
  medication: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: Date;
  decisionDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PriorAuthorizationService {
  private apiUrl = '/api/prior-authorizations';

  constructor(private http: HttpClient) {}

  getAuthorizations(patientId: number): Observable<PriorAuthorization[]> {
    return this.http.get<PriorAuthorization[]>(`${this.apiUrl}?patientId=${patientId}`);
  }

  createAuthorization(authData: Partial<PriorAuthorization>): Observable<PriorAuthorization> {
    return this.http.post<PriorAuthorization>(this.apiUrl, authData);
  }

  updateAuthorizationStatus(id: number, status: 'APPROVED' | 'REJECTED'): Observable<PriorAuthorization> {
    return this.http.patch<PriorAuthorization>(`${this.apiUrl}/${id}/status`, { status });
  }
}