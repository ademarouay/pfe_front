import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card shadow-lg border-0">
          <div class="card-header bg-sky-blue text-white text-center py-4">
            <h3 class="mb-0 fw-bold">Test d'envoi d'email</h3>
          </div>
          <div class="card-body p-4">
            <form [formGroup]="emailForm" (ngSubmit)="onSubmit()">
              <div class="form-floating mb-3">
                <input 
                  type="email" 
                  class="form-control border-0 bg-light" 
                  id="to" 
                  formControlName="to"
                  placeholder="Email"
                >
                <label for="to" class="text-sky-blue">Email du destinataire</label>
              </div>

              <div class="form-floating mb-3">
                <input 
                  type="text" 
                  class="form-control border-0 bg-light" 
                  id="subject" 
                  formControlName="subject"
                  placeholder="Sujet"
                >
                <label for="subject" class="text-sky-blue">Sujet</label>
              </div>

              <div class="form-floating mb-4">
                <textarea 
                  class="form-control border-0 bg-light" 
                  id="message" 
                  formControlName="message"
                  placeholder="Message"
                  style="height: 100px"
                ></textarea>
                <label for="message" class="text-sky-blue">Message</label>
              </div>

              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-sky-blue btn-lg"
                  [disabled]="emailForm.invalid || loading"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ loading ? 'Envoi en cours...' : 'Envoyer' }}
                </button>
              </div>
            </form>

            <div *ngIf="successMessage" class="alert alert-success mt-3">
              {{ successMessage }}
            </div>
            <div *ngIf="errorMessage" class="alert alert-danger mt-3">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmailTestComponent {
  emailForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.emailForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post('http://localhost:8082/api/email/send', this.emailForm.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.successMessage = response;
          this.emailForm.reset();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error || 'Erreur lors de l\'envoi de l\'email';
        }
      });
  }
}
