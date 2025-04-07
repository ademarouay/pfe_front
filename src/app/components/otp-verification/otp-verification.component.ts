import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';
import { OtpVerificationRequest } from '../../models/otp-verification-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Vérification OTP</h4>
            </div>
            <div class="card-body">
              <p class="text-muted mb-4">
                Un code de vérification à 6 chiffres a été envoyé à votre adresse email.
                Ce code est valable pendant 15 minutes.
              </p>
              
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>
              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>
              
              <form [formGroup]="otpForm" (ngSubmit)="onSubmit()" class="form">
                <div class="form-group mb-3">
                  <label for="otp" class="form-label">Code de vérification</label>
                  <input 
                    type="text" 
                    id="otp" 
                    formControlName="otp" 
                    class="form-control"
                    placeholder="Entrez le code à 6 chiffres"
                    maxlength="6">
                  <div *ngIf="otpForm.get('otp')?.invalid && otpForm.get('otp')?.touched" class="text-danger mt-1">
                    <small *ngIf="otpForm.get('otp')?.errors?.['required']">Le code OTP est requis</small>
                    <small *ngIf="otpForm.get('otp')?.errors?.['minlength']">Le code OTP doit contenir 6 chiffres</small>
                    <small *ngIf="otpForm.get('otp')?.errors?.['pattern']">Le code OTP doit contenir uniquement des chiffres</small>
                  </div>
                </div>
                
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="loading || otpForm.invalid">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Vérification...' : 'Vérifier' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./otp-verification.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class OtpVerificationComponent implements OnInit {
  otpForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private otpService: OtpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we have a codeCnam stored
    if (!this.otpService.currentCodeCnamValue) {
      this.errorMessage = 'Session expirée. Veuillez recommencer la préinscription.';
      setTimeout(() => {
        this.router.navigate(['/preinscription']);
      }, 3000);
      return;
    }

    this.otpForm = this.formBuilder.group({
      otp: ['', [
        Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$')
      ]]
    });
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: OtpVerificationRequest = {
      codeCnam: this.otpService.currentCodeCnamValue!,
      otp: this.otpForm.value.otp
    };

    this.authService.verifyOtp(request).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Vérification réussie! Redirection...';
        this.otpService.clearTempCodeCnam(); // Clear the stored codeCnam
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Code OTP invalide ou expiré. Veuillez réessayer.';
      }
    });
  }
}