import { Injectable } from '@angular/core';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  adresse: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patients: Patient[] = [
    {
      id: 1,
      nom: 'Ahmed',
      prenom: 'Ben Ali',
      dateNaissance: '1990-01-01',
      telephone: '123-456-7890',
      adresse: '123 Main St',
    },
    {
      id: 2,
      nom: 'Fatma',
      prenom: 'Trabelsi',
      dateNaissance: '1985-05-15',
      telephone: '987-654-3210',
      adresse: '456 Oak Ave',
    },
  ];

  getPatientById(id: number): Patient | undefined {
    return this.patients.find((patient) => patient.id === id);
  }

  createPatient(patient: Omit<Patient, 'id'>): Patient {
    const newPatient: Patient = {
      id: this.patients.length + 1,
      ...patient,
    };
    this.patients.push(newPatient);
    return newPatient;
  }
}