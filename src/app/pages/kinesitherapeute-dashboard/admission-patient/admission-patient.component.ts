import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admission-patient',
  templateUrl: './admission-patient.component.html',
  styleUrls: ['./admission-patient.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe]
})
export class AdmissionPatientComponent implements OnInit {
  admissionForm: FormGroup;

  constructor(private fb: FormBuilder) {
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

  ngOnInit(): void {}

  enregistrerAdmission(): void {
    if (this.admissionForm.valid) {
      console.log('Données du formulaire:', this.admissionForm.value);
      // Ajoutez ici la logique pour sauvegarder les données
    }
  }
}