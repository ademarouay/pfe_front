import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = 'http://localhost:8082/api/providers';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Données invalides.';
    } else if (error.status === 403) {
      errorMessage = 'Accès non autorisé.';
    } else {
      errorMessage = error.error?.message || 'Erreur serveur.';
    }
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }

  // Pharmacy specific methods
  validatePrescription(prescriptionId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pharmacy/prescriptions/${prescriptionId}/validate`, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateMedicationStock(medicationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pharmacy/stock`, medicationData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Laboratory specific methods
  submitExamResults(examId: number, results: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/laboratory/exams/${examId}/results`, results, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getExamRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/laboratory/exams/requests`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Hospital specific methods
  updateAdmissionStatus(admissionId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/hospital/admissions/${admissionId}/status`, { status }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  scheduleIntervention(interventionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/hospital/interventions`, interventionData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Nurse specific methods
  updateCareSchedule(scheduleData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/nurse/care-schedule`, scheduleData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  submitCareReport(reportData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/nurse/care-reports`, reportData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}