import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Claim {
  id: number;
  patientId: number;
  date: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = '/api/claims';

  constructor(private http: HttpClient) {}

  getClaimsByPatient(patientId: number): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}?patientId=${patientId}`);
  }

  trackClaimStatus(claimId: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${claimId}/status`);
  }

  submitClaim(claimData: Partial<Claim>): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claimData);
  }
}