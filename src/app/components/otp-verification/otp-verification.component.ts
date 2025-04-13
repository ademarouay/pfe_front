import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';
import { OtpVerificationRequest } from '../../models/otp-verification-request';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule]
})
export class OtpVerificationComponent implements OnInit {
  // Font Awesome icons
  faEnvelope = faEnvelope;
  faLock = faLock;
  faCircleCheck = faCircleCheck;
  faCircleExclamation = faCircleExclamation;
  otpForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  invalidCharMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private otpService: OtpService,
    private router: Router
  ) {}

  onKeyPress(event: KeyboardEvent): void {
    const char = event.key;
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
      this.invalidCharMessage = 'Veuillez saisir uniquement des chiffres';
      setTimeout(() => {
        this.invalidCharMessage = '';
      }, 3000);
    }
  }

  ngOnInit(): void {
    // Check if we have a codeCnam stored
   
      setTimeout(() => {
        this.loading = false; // Après 3 secondes, afficher "Vérifier"
      }, 3000);
    if (!this.otpService.currentCodeCnamValue) {
      this.errorMessage = 'Session expirée. Veuillez recommencer la préinscription.';
      
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
        this.otpService.clearTempCodeCnam(); // Clear the stored codeCnam
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Code OTP invalide ou expiré. Veuillez réessayer.';
      }
    });
  }
}