import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Utilisateur } from '../models/utilisateur';
import { Prescription } from '../models/prescription';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = 'http://localhost:8082/api/prescriptions';

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
    } else if (error.status === 404) {
      errorMessage = 'Prescription non trouvée.';
    } else {
      errorMessage = error.error?.message || 'Erreur serveur.';
    }

    return throwError(() => ({ message: errorMessage, status: error.status }));
  }

  // Get active prescriptions for the current user
  getActivePrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/active`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create a new prescription
  createPrescription(prescriptionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, prescriptionData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get prescription by ID
  getPrescriptionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get prescriptions by patient CNAM code
  getPrescriptionsByPatient(codeCnam: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${codeCnam}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get prescriptions created by a medical professional
  getPrescriptionsByPrescriber(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/prescriber/${userId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Update prescription status (for CNAM validation)
  updatePrescriptionStatus(prescriptionId: number, status: string, comment?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${prescriptionId}/status`, { status, comment }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Add digital signature to prescription
  signPrescription(prescriptionId: number, signature: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${prescriptionId}/sign`, { signature }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get prescriptions pending CNAM validation
  getPendingPrescriptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get validated prescriptions for pharmacy/laboratory
  getValidatedPrescriptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validated`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}