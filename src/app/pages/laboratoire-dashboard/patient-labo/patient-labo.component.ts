import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-patient-labo',
  templateUrl: './patient-labo.component.html',
  styleUrls: ['./patient-labo.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputTextarea,
    TooltipModule
  ]
})
export class PatientLaboComponent implements OnInit {
  searchTerm: string = '';
  filteredPatients: any[] = [];
  dialogVisible: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  patientForm: FormGroup;
  genreOptions = [
    { label: 'Homme', value: 'HOMME' },
    { label: 'Femme', value: 'FEMME' }
  ];

  constructor(private fb: FormBuilder) {
    // Initialize the FormGroup
    this.patientForm = this.fb.group({
      codeCnam: [null],
      nomComplet: ['', Validators.required],
      dateNaissance: [null, Validators.required],
      genre: ['', Validators.required],
      numeroTelephone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.filteredPatients = this.patients;
  }

  patients = [
    { id: 1, nomComplet: 'John Doe', genre: 'HOMME', dateNaissance: new Date('1990-01-01'), numeroTelephone: '12345678', email: 'john@example.com', status: 'ACTIF', codeCnam: 123456, adresse: 'Tunis' },
    { id: 2, nomComplet: 'Jane Smith', genre: 'FEMME', dateNaissance: new Date('1992-05-15'), numeroTelephone: '87654321', email: 'jane@example.com', status: 'INACTIF', codeCnam: 654321, adresse: 'Sfax' }
  ];

 

  onSearch() {
    if (!this.searchTerm) {
      this.filteredPatients = this.patients;
      return;
    }
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.nomComplet.toLowerCase().includes(searchTermLower) ||
      patient.id.toString().includes(searchTermLower) ||
      patient.email.toLowerCase().includes(searchTermLower) ||
      patient.numeroTelephone.includes(searchTermLower)
    );
  }

  showAddPatientDialog() {
    this.editMode = false;
    this.viewMode = false;
    this.dialogVisible = true;
    this.patientForm.reset();
  }

  getDialogHeader(): string {
    if (this.viewMode) return 'Détails du Patient';
    return this.editMode ? 'Modifier Patient' : 'Ajouter Patient';
  }

  onDialogCancel() {
    this.dialogVisible = false;
    this.patientForm.reset();
  }

  onDialogSave() {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      if (this.editMode) {
        // Update existing patient
        const index = this.patients.findIndex(p => p.id === patientData.id);
        if (index !== -1) {
          this.patients[index] = { ...this.patients[index], ...patientData };
        }
      } else {
        // Add new patient
        const newPatient = {
          id: this.patients.length + 1,
          ...patientData,
          status: 'ACTIF'
        };
        this.patients.push(newPatient);
      }
      this.dialogVisible = false;
      this.patientForm.reset();
      this.onSearch(); // Refresh the filtered list
    }
  }

  getBadgeClass(status: string): string {
    return status === 'ACTIF' ? 'bg-success' : 'bg-danger';
  }

  viewPatient(patient: any) {
    this.viewMode = true;
    this.editMode = false;
    this.dialogVisible = true;
    this.patientForm.patchValue(patient);
  }

  editPatient(patient: any) {
    this.viewMode = false;
    this.editMode = true;
    this.dialogVisible = true;
    this.patientForm.patchValue(patient);
  }

  deletePatient(id: number) {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
      this.onSearch(); // Refresh the filtered list
    }
  }
}