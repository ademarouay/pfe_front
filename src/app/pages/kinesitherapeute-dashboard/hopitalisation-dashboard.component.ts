import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hopitalisation-dashboard',
  templateUrl: './hopitalisation-dashboard.component.html',
  styleUrls: ['./hopitalisation-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class HopitalisationDashboardComponent {
  admissionForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.admissionForm = this.fb.group({
      nomPatient: ['', Validators.required],
      prenomPatient: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      typeConsultation: ['', Validators.required],
      typePriseEnCharge: ['', Validators.required],
      dateEntree: ['', Validators.required],
      informationsSoins: [''],
    });
  }

  enregistrerAdmission(): void {
    if (this.admissionForm.valid) {
      console.log('Données de l\'admission:', this.admissionForm.value);
      this.admissionForm.reset();
    }
  }


}