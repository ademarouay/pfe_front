import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';
import { PreinscriptionRequest } from '../../models/preinscription-request';
import { OtpVerificationRequest } from '../../models/otp-verification-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preinscription',
  templateUrl: './preinscription.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./preinscription.component.css']
})
export class PreinscriptionComponent implements OnInit {
  preinscriptionForm!: FormGroup;
  otpForm!: FormGroup;
  isOtpSent = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private otpService: OtpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.preinscriptionForm = this.formBuilder.group({
      codeCnam: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onPreinscriptionSubmit(): void {
    if (this.preinscriptionForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: Partial<PreinscriptionRequest> = {
      codeCnam: Number(this.preinscriptionForm.value.codeCnam),
      nom: this.preinscriptionForm.value.nom,
      email: this.preinscriptionForm.value.email
    };

    this.authService.preinscription(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.isOtpSent = true;
        this.successMessage = 'Un code OTP a été envoyé à votre adresse email.';
        if (request.codeCnam) {
          this.otpService.setTempCodeCnam(request.codeCnam);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la préinscription.';
      }
    });
  }

  onOtpSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: OtpVerificationRequest = {
      codeCnam: this.otpService.currentCodeCnamValue || Number(this.preinscriptionForm.value.codeCnam),
      otp: this.otpForm.value.otp
    };

    this.authService.verifyOtp(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.otpService.clearTempCodeCnam();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Code OTP invalide ou expiré.';
      }
    });
  }

  // Helper method to validate form controls
  get formControls() {
    return this.preinscriptionForm.controls;
  }

  get otpControls() {
    return this.otpForm.controls;
  }
}