import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNGModule } from '../../../primeng.module';

interface Patient {
  id: number;
  codeCnam: number;
  nomComplet: string;
  dateNaissance: Date;
  genre: string;
  numeroTelephone: string;
  email: string;
  adresse: string;
  lastVisit: Date;
  medicalHistory?: string[];
  electronicHealthRecord?: {
    diagnoses: string[];
    treatments: string[];
    medications: string[];
    allergies: string[];
    bloodType: string;
    lastUpdated: Date;
  };
}

@Component({
  selector: 'app-patient-management',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, PrimeNGModule]
})
export class PatientManagementComponent implements OnInit {
  patients: Patient[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  newPatient: Patient = {
    id: 0,
    codeCnam: 0,
    nomComplet: '',
    dateNaissance: new Date(),
    genre: '',
    numeroTelephone: '',
    email: '',
    adresse: '',
    lastVisit: new Date()
  };
  showAddPatientPopup = false;

  displayDialog = false;
  displayPatientsDialog = false;
  selectedPatient: Patient | null = null;
  isNewPatient = false;
  showHealthRecord = false;

  genderOptions = [
    { label: 'Masculin', value: 'M' },
    { label: 'Féminin', value: 'F' }
  ];

  patientForm: Patient = {
    id: 0,
    codeCnam: 0,
    nomComplet: '',
    dateNaissance: new Date(),
    genre: '',
    numeroTelephone: '',
    email: '',
    adresse: '',
    lastVisit: new Date()
  };

  constructor() {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    // TODO: Replace with actual servicae call
    this.patients = [
      {
        id: 1,
        codeCnam: 123456,
        nomComplet: 'John Doe',
        dateNaissance: new Date('1990-01-01'),
        genre: 'M',
        numeroTelephone: '+216 12 345 678',
        email: 'john.doe@example.com',
        adresse: '123 Main St, City',
        lastVisit: new Date(Date.now() - 7 * 86400000),
        electronicHealthRecord: {
          diagnoses: ['Hypertension', 'Diabète type 2'],
          treatments: ['Régime alimentaire', 'Exercice physique'],
          medications: ['Metformine', 'Lisinopril'],
          allergies: ['Pénicilline'],
          bloodType: 'A+',
          lastUpdated: new Date()
        }
      },
      {
        id: 2,
        codeCnam: 234567,
        nomComplet: 'Marie Dupont',
        dateNaissance: new Date('1985-05-15'),
        genre: 'F',
        numeroTelephone: '+216 23 456 789',
        email: 'marie.dupont@example.com',
        adresse: '456 Avenue des Fleurs, Ville',
        lastVisit: new Date(Date.now() - 2 * 86400000),
        electronicHealthRecord: {
          diagnoses: ['Asthme', 'Allergie saisonnière'],
          treatments: ['Inhalateur', 'Antihistaminiques'],
          medications: ['Ventoline', 'Cetirizine'],
          allergies: ['Pollen', 'Acariens'],
          bloodType: 'O-',
          lastUpdated: new Date()
        }
      },
      {
        id: 3,
        codeCnam: 345678,
        nomComplet: 'Ahmed Ben Ali',
        dateNaissance: new Date('1978-12-20'),
        genre: 'M',
        numeroTelephone: '+216 34 567 890',
        email: 'ahmed.benali@example.com',
        adresse: '789 Rue de la Médina, Tunis',
        lastVisit: new Date(Date.now() - 14 * 86400000),
        electronicHealthRecord: {
          diagnoses: ['Arthrite rhumatoïde', 'Hypertension'],
          treatments: ['Physiothérapie', 'Surveillance tensionnelle'],
          medications: ['Méthotrexate', 'Amlodipine'],
          allergies: ['Aspirine', 'Fruits de mer'],
          bloodType: 'B+',
          lastUpdated: new Date()
        }
      }
    ];
    this.totalItems = this.patients.length;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPatients();
  }

  showAddPatientDialog(): void {
    this.isNewPatient = true;
    this.patientForm = {
      id: 0,
      codeCnam: 0,
      nomComplet: '',
      dateNaissance: new Date(),
      genre: '',
      numeroTelephone: '',
      email: '',
      adresse: '',
      lastVisit: new Date()
    };
    this.displayDialog = true;
  }

  searchPatients(): void {
    const term = this.searchTerm.toLowerCase();
    this.patients = this.patients.filter(patient =>
      patient.nomComplet.toLowerCase().includes(term) ||
      patient.codeCnam.toString().includes(term)
    );
  }

  openAddPatientPopup(): void {
    this.showAddPatientPopup = true;
    this.newPatient = {
      id: 0,
      codeCnam: 0,
      nomComplet: '',
      dateNaissance: new Date(),
      genre: '',
      numeroTelephone: '',
      email: '',
      adresse: '',
      lastVisit: new Date()
    };
  }

  closeAddPatientPopup(): void {
    this.showAddPatientPopup = false;
  }

  addPatient(): void {
    this.newPatient.id = this.patients.length + 1;
    this.patients.push({ ...this.newPatient });
    this.closeAddPatientPopup();
  }

  showEditPatientDialog(patient: Patient): void {
    this.isNewPatient = false;
    this.patientForm = { ...patient };
    this.displayDialog = true;
  }

  submitted = false;

  savePatient(): void {
    this.submitted = true;
    if (!this.patientForm.codeCnam) {
      return;
    }
    if (this.isNewPatient) {
      this.patientForm.id = this.patients.length + 1;
      this.patients.push({ ...this.patientForm });
    } else {
      const index = this.patients.findIndex(p => p.id === this.patientForm.id);
      if (index !== -1) {
        this.patients[index] = { ...this.patientForm };
      }
    }
    this.displayDialog = false;
  }

  deletePatient(patient: Patient): void {
    this.patients = this.patients.filter(p => p.id !== patient.id);
  }

  viewHealthRecord(patient: Patient): void {
    this.selectedPatient = patient;
    this.showHealthRecord = true;
  }

  closeHealthRecord(): void {
    this.showHealthRecord = false;
    this.selectedPatient = null;
  }
}