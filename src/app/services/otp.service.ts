import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private apiUrl = 'http://localhost:8082/api/otp';
  private tempCodeCnamSubject = new BehaviorSubject<number | null>(null);
  public tempCodeCnam = this.tempCodeCnamSubject.asObservable();
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_MINUTES = 30;
  private attempts = new Map<number, { count: number; lastAttempt: Date }>();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  generateOtp(codeCnam: number): Observable<any> {
    const userAttempts = this.attempts.get(codeCnam);
    if (userAttempts && userAttempts.count >= this.MAX_ATTEMPTS) {
      const lockoutEnd = new Date(userAttempts.lastAttempt.getTime() + this.LOCKOUT_MINUTES * 60 * 1000);
      if (new Date() < lockoutEnd) {
        const remainingMinutes = Math.ceil((lockoutEnd.getTime() - new Date().getTime()) / 60000);
        return throwError(() => `Too many attempts. Please try again in ${remainingMinutes} minutes.`);
      }
      this.attempts.delete(codeCnam);
    }

    return this.http.post(`${this.apiUrl}/generate`, { codeCnam }, this.httpOptions)
      .pipe(
        map(response => {
          this.setTempCodeCnam(codeCnam);
          // Start expiration timer
          setTimeout(() => {
            if (this.currentCodeCnamValue === codeCnam) {
              this.clearTempCodeCnam();
            }
          }, this.OTP_EXPIRY_MINUTES * 60 * 1000);
          return response;
        }),
        catchError(error => {
          console.error('Error generating OTP:', error);
          return throwError(() => error.error?.message || 'Failed to generate OTP. Please try again.');
        })
      );
  }

  verifyOtp(otp: string): Observable<boolean> {
    const codeCnam = this.tempCodeCnamSubject.value;
    if (!codeCnam) {
      return throwError(() => ({ message: 'No temporary CNAM code found', status: 400 }));
    }

    const userAttempts = this.attempts.get(codeCnam) || { count: 0, lastAttempt: new Date() };
    userAttempts.count++;
    userAttempts.lastAttempt = new Date();
    this.attempts.set(codeCnam, userAttempts);

    if (userAttempts.count > this.MAX_ATTEMPTS) {
      const lockoutEnd = new Date(userAttempts.lastAttempt.getTime() + this.LOCKOUT_MINUTES * 60 * 1000);
      const remainingMinutes = Math.ceil((lockoutEnd.getTime() - new Date().getTime()) / 60000);
      return throwError(() => ({ 
        message: `Too many attempts. Please try again in ${remainingMinutes} minutes.`,
        status: 429
      }));
    }

    return this.http.post<boolean>(`${this.apiUrl}/verify`, { codeCnam, otp }, this.httpOptions)
      .pipe(
        map(response => {
          if (response) {
            this.clearTempCodeCnam();
            this.attempts.delete(codeCnam);
          }
          return response;
        }),
        catchError(error => {
          const errorMessage = error.error?.message || 'OTP verification failed';
          return throwError(() => ({ message: errorMessage, status: error.status || 400 }));
        })
      );
  }

  setTempCodeCnam(codeCnam: number): void {
    this.tempCodeCnamSubject.next(codeCnam);
    setTimeout(() => this.clearTempCodeCnam(), this.OTP_EXPIRY_MINUTES * 60 * 1000);
  }

  clearTempCodeCnam(): void {
    this.tempCodeCnamSubject.next(null);
  }

  private handleError(error: any) {
    console.error('OTP service error:', error);
    return throwError(() => error.error?.message || 'OTP operation failed');
  }

  // Get current codeCnam value
  get currentCodeCnamValue(): number | null {
    return this.tempCodeCnamSubject.value;
  }
}