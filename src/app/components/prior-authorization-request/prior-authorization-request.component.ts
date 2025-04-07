import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PriorAuthorizationService } from '../../services/prior-authorization.service';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../models/prescription';

@Component({
  standalone: true,
  selector: 'app-prior-authorization-request',
  templateUrl: './prior-authorization-request.component.html',
  imports: [ReactiveFormsModule, CommonModule]
})
export class PriorAuthorizationRequestComponent implements OnInit {
  authForm: FormGroup;
  prescriptions: Prescription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: PriorAuthorizationService,
    private prescriptionService: PrescriptionService
  ) {
    this.authForm = this.fb.group({
      prescriptionId: ['', Validators.required],
      justification: ['', Validators.required],
      documents: [[]]
    });
  }

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.prescriptionService.getPrescriptionsByPatient(1).subscribe({
      next: (prescriptions) => this.prescriptions = prescriptions,
      error: (err) => console.error('Erreur chargement prescriptions', err)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.authForm.patchValue({ documents: Array.from(input.files) });
    }
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.authService.createAuthorization(this.authForm.value).subscribe({
        next: () => alert('Demande soumise avec succès !'),
        error: (err) => console.error('Erreur soumission', err)
      });
    }
  }
}
