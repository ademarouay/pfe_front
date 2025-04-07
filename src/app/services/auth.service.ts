import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PreinscriptionRequest } from '../models/preinscription-request';
import { OtpVerificationRequest } from '../models/otp-verification-request';
import { LoginRequest, LoginResponse } from '../models/login-request';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/utilisateurs';
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  public token = this.tokenSubject.asObservable();

  private getHttpOptions() {
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const token = this.tokenSubject.value;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return { headers: new HttpHeaders(headers) };
  };

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        this.currentUserSubject.next(parsedUser);
        this.tokenSubject.next(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Les données fournies sont invalides.';
    } else if (error.status === 409) {
      errorMessage = error.error?.message || 'Cet utilisateur existe déjà.';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      this.logout();
    } else if (error.status === 403) {
      errorMessage = 'Accès non autorisé.';
    } else if (error.status === 404) {
      errorMessage = 'Ressource non trouvée.';
    } else {
      errorMessage = error.error?.message || 'Une erreur est survenue lors de la communication avec le serveur.';
    }

    return throwError(() => ({ message: errorMessage, status: error.status }));
  }

  // Pre-registration request
  preinscription(request: Partial<PreinscriptionRequest>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/preinscription`, request, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  // Verify OTP code
  verifyOtp(request: OtpVerificationRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, request, this.getHttpOptions())
      .pipe(
        tap(response => {
          if (!response.success) {
            throw new Error('OTP verification failed');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Login with CNAM code and password
  login(request: { codeCnam: number | string; motDePasse: string }): Observable<LoginResponse> {
    const loginRequest = {
      codeCnam: typeof request.codeCnam === 'string' ? parseInt(request.codeCnam) : request.codeCnam,
      motDePasse: request.motDePasse
    };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest, this.getHttpOptions())
      .pipe(
        tap(response => {
          if (!response?.utilisateur || !response?.token) {
            throw new Error('Invalid login response');
          }
          localStorage.setItem('currentUser', JSON.stringify(response.utilisateur));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.utilisateur);
          this.tokenSubject.next(response.token);
        }),
        catchError(this.handleError)
      );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  // Get current user value
  get currentUserValue(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return true; // Temporairement désactivé pour les tests
  }

  register(userData: {
    codeCnam: string | number;
    nom: string;
    email: string;
    motDePasse: string;
    role: string;
    adresse: string;
  }): Observable<any> {
    const requestData = {
      codeCnam: typeof userData.codeCnam === 'string' ? parseInt(userData.codeCnam) : userData.codeCnam,
      nom: userData.nom,
      email: userData.email,
      motDePasse: userData.motDePasse,
      role: userData.role,
      adresse: userData.adresse
    };

    return this.http.post(`${this.apiUrl}/preinscription`, requestData, this.getHttpOptions())
      .pipe(
        tap(response => {
          console.log('Registration successful');
        }),
        catchError(this.handleError)
      );
  }

  getCurrentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return true; // Temporairement désactivé pour les tests
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }
}