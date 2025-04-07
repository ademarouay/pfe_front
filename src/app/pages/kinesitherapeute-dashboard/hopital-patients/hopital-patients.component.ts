import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Required PrimeNG Modules for Dialog, Table, Buttons, Inputs etc.
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextarea } from 'primeng/inputtextarea'; // Correct import
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

// Define Patient Interface (ensure it matches your data)
export interface Patient {
  id: number;
  codeCnam: number | null;
  nomComplet: string;
  dateNaissance: Date | string | null; // Allow null for form reset
  genre: string;
  numeroTelephone: string;
  email: string;
  adresse: string;
  lastVisit: Date | string | null; // Allow null for form reset
  admissionDate?: Date | string | null; // Allow null for form reset
  consultationType?: string;
  status?: 'En traitement' | 'En attente' | 'Sorti';
}

@Component({
  selector: 'app-hopital-patients',
  templateUrl: './hopital-patients.component.html', // Ensure this points to the HTML with the <p-dialog>
  styleUrls: ['./hopital-patients.component.css'],   // Ensure this points to the CSS with dialog styles
  standalone: true,
  imports: [ // *** Imports including CORRECTED InputTextarea ***
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,

    // PrimeNG Modules
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    InputTextarea, // Correct import
    DropdownModule,
    TooltipModule,
  ]
})
export class HopitalPatientsComponent implements OnInit { // Class definition

  allPatients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';

  // --- Dialog State Variables ---
  dialogVisible: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  selectedPatient: Patient | null = null;
  patientForm: FormGroup;

  // --- Dropdown Options ---
  genreOptions = [
    { label: 'Homme', value: 'Homme' },
    { label: 'Femme', value: 'Femme' },
  ];

  statusOptions = [
      { label: 'En traitement', value: 'En traitement' },
      { label: 'En attente', value: 'En attente' },
      { label: 'Sorti', value: 'Sorti' }
  ];

  // Inject FormBuilder
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

  ngOnInit(): void {
    this.allPatients = this.getMockPatients();
    this.filteredPatients = [...this.allPatients];
  }

  // *** ALL methods required by the template are included below ***

  getMockPatients(): Patient[] {
    // (Keep your existing mock data function - ensure dates are Date objects)
     return [
        {
            id: 1, codeCnam: 12345, nomComplet: 'Dupont Jean', dateNaissance: new Date('1985-05-20'),
            genre: 'Homme', numeroTelephone: '0123456789', email: 'jean.dupont@email.com',
            adresse: '1 Rue de la Paix, Paris', lastVisit: new Date('2024-03-10'),
            admissionDate: new Date('2024-01-15'), consultationType: 'Consultation générale', status: 'En traitement'
          },
          {
            id: 2, codeCnam: 67890, nomComplet: 'Martin Sophie', dateNaissance: new Date('1992-11-30'),
            genre: 'Femme', numeroTelephone: '0987654321', email: 'sophie.martin@email.com',
            adresse: '10 Avenue des Champs, Lyon', lastVisit: new Date('2024-03-15'),
            admissionDate: new Date('2024-01-14'), consultationType: 'Rééducation', status: 'En attente'
          },
          {
            id: 3, codeCnam: 11223, nomComplet: 'Garcia Pierre', dateNaissance: new Date('1978-02-10'),
            genre: 'Homme', numeroTelephone: '0611223344', email: 'pierre.garcia@email.com',
            adresse: '5 Boulevard Victor Hugo, Marseille', lastVisit: new Date('2023-12-01'),
            admissionDate: new Date('2024-01-20'), consultationType: 'Cardiologie', status: 'Sorti'
          }
    ];
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPatients = [...this.allPatients];
    } else {
      this.filteredPatients = this.allPatients.filter(patient =>
        patient.nomComplet.toLowerCase().includes(term) ||
        patient.id.toString().includes(term) ||
        (patient.codeCnam && patient.codeCnam.toString().includes(term)) ||
        patient.email.toLowerCase().includes(term) ||
        patient.numeroTelephone.includes(term)
      );
    }
  }

  // --- Dialog Open Methods ---
  showAddPatientDialog(): void {
    this.selectedPatient = null;
    this.viewMode = false;
    this.editMode = false;
    this.patientForm.reset();
    this.patientForm.enable();
    this.dialogVisible = true;
  }

  viewPatient(patient: Patient): void {
    this.selectedPatient = { ...patient };
    this.viewMode = true;
    this.editMode = false;
    this.patientForm.patchValue({
      ...patient,
      dateNaissance: patient.dateNaissance ? new Date(patient.dateNaissance) : null,
    });
    this.patientForm.disable();
    this.dialogVisible = true;
  }

  editPatient(patient: Patient): void {
    this.selectedPatient = { ...patient };
    this.viewMode = false;
    this.editMode = true;
    this.patientForm.patchValue({
      ...patient,
      dateNaissance: patient.dateNaissance ? new Date(patient.dateNaissance) : null,
    });
    this.patientForm.enable();
    this.dialogVisible = true;
  }

  deletePatient(id: number): void {
     if(confirm('Êtes-vous sûr de vouloir supprimer ce patient?')) {
        this.allPatients = this.allPatients.filter(p => p.id !== id);
        this.onSearch(); // Refresh filtered list
     }
  }

  // --- Dialog Save/Cancel ---
  onDialogSave(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const formData = this.patientForm.getRawValue();

    if (this.editMode && this.selectedPatient) {
      const index = this.allPatients.findIndex(p => p.id === this.selectedPatient!.id);
      if (index !== -1) {
        const updatedPatient = {
            ...this.allPatients[index],
            ...formData,
            id: this.selectedPatient.id
        };
        this.allPatients[index] = updatedPatient;
      }
    } else {
      const newPatient: Patient = {
        id: this.generateNewPatientId(),
        ...formData,
        lastVisit: new Date(),
        status: 'En attente',
      };
      this.allPatients.push(newPatient);
    }

    this.onSearch(); // Refresh filtered list
    this.dialogVisible = false;
  }

  onDialogCancel(): void {
    this.dialogVisible = false;
  }

  // --- Utility Methods ---
  private generateNewPatientId(): number {
    return this.allPatients.length > 0 ? Math.max(...this.allPatients.map(p => p.id)) + 1 : 1;
  }

  getDialogHeader(): string { // Method for dialog title
    if (this.viewMode) {
      return 'Détails du Patient';
    } else if (this.editMode) {
      return 'Modifier le Patient';
    } else {
      return 'Ajouter un Patient';
    }
  }

  getBadgeClass(status: string | undefined): string { // Method for status badge class
     switch (status) {
       case 'En traitement': return 'bg-success';
       case 'En attente': return 'bg-warning text-dark';
       case 'Sorti': return 'bg-secondary';
       default: return 'bg-light text-dark'; // Ensure this line is correct
     }
  }

} // *** IMPORTANT: This is the final closing brace for the class ***