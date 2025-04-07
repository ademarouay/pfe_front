import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      codeCnam: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      motDePasse: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: LoginRequest = {
      codeCnam: Number(this.loginForm.value.codeCnam),
      motDePasse: this.loginForm.value.motDePasse
    };

    // Note: Your backend needs to have a login endpoint
    this.authService.login(request).subscribe({
      next: (response) => {
        this.loading = false;
        
        // Navigate to home page after successful login
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Identifiants invalides. Veuillez réessayer.';
      }
    });
  }

  // Helper method to validate form controls
  get formControls() {
    return this.loginForm.controls;
  }
}