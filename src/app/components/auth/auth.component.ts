import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../models/utilisateur';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode = true;
  loading = false;
  errorMessage = '';
  successMessage = '';
  roles = Object.values(Role);
  showPassword = false;

  // Regex pour la validation du mot de passe
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Déterminer le mode en fonction de l'URL
    this.isLoginMode = this.router.url === '/login';
    this.initForm();
  }

  private initForm(): void {
    const baseForm = {
      codeCnam: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      motDePasse: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordRegex)
      ]],
    };

    const registrationFields = {
      ...baseForm,
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      role: ['ETUDIANT', Validators.required],
      confirmMotDePasse: ['', Validators.required]
    };

    this.authForm = this.formBuilder.group(
      this.isLoginMode ? baseForm : registrationFields,
      {
        validators: this.isLoginMode ? [] : [this.passwordMatchValidator]
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordErrors(): string {
    const control = this.authForm.get('motDePasse');
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Le mot de passe est requis';
      }
      if (control.errors['minlength']) {
        return 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (control.errors['pattern']) {
        return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial';
      }
    }
    return '';
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.initForm();
    // Mettre à jour l'URL
    this.router.navigate([this.isLoginMode ? '/login' : '/preinscription']);
  }

  private passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const password = group.get('motDePasse');
    const confirmPassword = group.get('confirmMotDePasse');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      Object.keys(this.authForm.controls).forEach(key => {
        const control = this.authForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.login();
    } else {
      this.register();
    }
  }

  private login(): void {
    const loginData = {
      codeCnam: Number(this.authForm.value.codeCnam),
      motDePasse: this.authForm.value.motDePasse
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur de connexion. Veuillez réessayer.';
      }
    });
  }

  private register(): void {
    if (this.authForm.invalid) {
      return;
    }

    const registrationData = {
      codeCnam: this.authForm.value.codeCnam,
      nom: this.authForm.value.nom,
      email: this.authForm.value.email,
      motDePasse: this.authForm.value.motDePasse,
      adresse: this.authForm.value.adresse,
      role: this.authForm.value.role
    };

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Préinscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la préinscription. Veuillez réessayer.';
      }
    });
  }

  get formControls() {
    return this.authForm.controls;
  }
} 