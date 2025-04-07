import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Consultation {
  id: string;
  date: Date;
  patientName: string;
  doctorName: string;
  status: 'EN_COURS' | 'VALIDEE' | 'ANNULEE';
}

@Injectable({
  providedIn: 'root'
})
export class PharmacienConsultationService {
  constructor(private http: HttpClient) {}

  getAllConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>('/api/consultations');
  }
}