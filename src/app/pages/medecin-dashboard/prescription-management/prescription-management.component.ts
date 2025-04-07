import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextarea } from 'primeng/inputtextarea';

import { Prescription, PrescriptionStatus, PrescriptionType } from '../../../models/prescription';

interface PriorAuthorization {
  id: number;
  status: string;
  prescriptionId: number;
  submissionDate: Date;
}
import { PrescriptionService } from '../../../services/prescription.service';
import { PriorAuthorizationService } from '../../../services/prior-authorization.service';

interface Consultation {
  nomPatient: string;
  codeCnam: string;
  descriptionMedicale: string;
  maladie: string;
  ordonnanceConcernee: string;
  prixConsultation: number;
}

@Component({
  selector: 'app-prescription-management',
  templateUrl: './prescription-management.component.html',
  styleUrls: ['./prescription-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    DialogModule,
    InputTextarea
  ]
})
export class PrescriptionManagementComponent implements OnInit {
  prescriptions: Prescription[] = [
    {
      id: 1,
      patientCodeCnam: 12345678,
      medecinId: 1,
      dateCreation: new Date('2024-01-15'),
      status: PrescriptionStatus.EN_ATTENTE,
      type: PrescriptionType.MEDICAMENT,
      contenu: 'Doliprane 1000mg - 2 fois par jour',
      commentaire: 'Prendre pendant les repas'
    },
    {
      id: 2,
      patientCodeCnam: 23456789,
      medecinId: 1,
      dateCreation: new Date('2024-01-14'),
      status: PrescriptionStatus.VALIDEE,
      type: PrescriptionType.EXAMEN,
      contenu: 'Radiographie pulmonaire',
      commentaire: 'Urgent'
    },
    {
      id: 3,
      patientCodeCnam: 34567890,
      medecinId: 1,
      dateCreation: new Date('2024-01-13'),
      status: PrescriptionStatus.EXECUTEE,
      type: PrescriptionType.MEDICAMENT,
      contenu: 'Amoxicilline 500mg - 3 fois par jour',
      commentaire: 'Traitement antibiotique'
    },
    {
      id: 4,
      patientCodeCnam: 45678901,
      medecinId: 1,
      dateCreation: new Date('2024-01-12'),
      status: PrescriptionStatus.REFUSEE,
      type: PrescriptionType.HOSPITALISATION,
      contenu: 'Hospitalisation pour observation',
      commentaire: 'Refusé par manque de justification'
    },
    {
      id: 5,
      patientCodeCnam: 56789012,
      medecinId: 1,
      dateCreation: new Date('2024-01-11'),
      status: PrescriptionStatus.EXPIREE,
      type: PrescriptionType.SOIN,
      contenu: 'Séances de kinésithérapie',
      commentaire: 'Prescription expirée'
    }
  ];
  priorAuthorizations: PriorAuthorization[] = [];
  activeTab: 'prescriptions' | 'authorizations' = 'prescriptions';
  authorizations: PriorAuthorization[] = [];

  searchTerm: string = '';
  displayNewPrescriptionDialog: boolean = false;
  displayPrescriptionDetails: boolean = false;
  selectedPrescription: any;
  patients = [
    { name: 'Patient 1', id: 1 },
    { name: 'Patient 2', id: 2 },
    { name: 'Patient 3', id: 3 }
  ];
  prescriptionTypes = [
    { name: 'Médicament', value: PrescriptionType.MEDICAMENT },
    { name: 'Examen', value: PrescriptionType.EXAMEN },
    { name: 'Hospitalisation', value: PrescriptionType.HOSPITALISATION },
    { name: 'Soin', value: PrescriptionType.SOIN }
  ];

  // Consultation related properties
  newConsultation: Consultation = {
    nomPatient: '',
    codeCnam: '',
    descriptionMedicale: '',
    maladie: '',
    ordonnanceConcernee: '',
    prixConsultation: 0
  };

  showNewPrescriptionDialog() {
    this.displayNewPrescriptionDialog = true;
  }

  createPrescription() {
    // TODO: Implement prescription creation logic
    this.displayNewPrescriptionDialog = false;
  }

  constructor(
    private prescriptionService: PrescriptionService,
    private authService: PriorAuthorizationService
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
    this.loadAuthorizations();
  }

  loadAuthorizations(): void {
    this.authService.getAuthorizations(1).subscribe({
      next: (auths) => this.authorizations = auths,
      error: (err) => console.error('Erreur chargement autorisations', err)
    });
  }

  get totalPrescriptions(): number {
    return this.prescriptions.length;
  }

  get pendingPrescriptions(): number {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.EN_ATTENTE).length;
  }

  get validatedPrescriptions(): number {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.VALIDEE).length;
  }

  get executedPrescriptions(): number {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.EXECUTEE).length;
  }

  get rejectedPrescriptions(): number {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.REFUSEE).length;
  }

  get expiredPrescriptions(): number {
    return this.prescriptions.filter(p => p.status === PrescriptionStatus.EXPIREE).length;
  }

  loadPrescriptions(): void {
    // Commented out service call for demo purposes
    // this.prescriptionService.getPrescriptionsByPrescriber(1).subscribe({
    //   next: (prescriptions) => {
    //     this.prescriptions = prescriptions;
    //   },
    //   error: (error) => {
    //     console.error('Error loading prescriptions:', error);
    //   }
    // });
  }

  getStatusClass(status: PrescriptionStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case PrescriptionStatus.VALIDEE:
        return 'success';
      case PrescriptionStatus.EN_ATTENTE:
        return 'warn';
      case PrescriptionStatus.REFUSEE:
        return 'danger';
      case PrescriptionStatus.EXECUTEE:
        return 'info';
      case PrescriptionStatus.EXPIREE:
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  switchTab(tab: 'prescriptions' | 'authorizations'): void {
    this.activeTab = tab;
  }

  showPrescriptionDetails(prescription: any) {
    this.selectedPrescription = prescription;
    this.displayPrescriptionDetails = true;
  }

  displayModifyDialog: boolean = false;
  modifiedPrescription: any;

  modifyPrescription(prescription: any) {
    this.selectedPrescription = { ...prescription };
    this.modifiedPrescription = { ...prescription };
    this.displayModifyDialog = true;
  }

  saveModifiedPrescription() {
    console.log('Modified prescription:', this.modifiedPrescription);
    this.displayModifyDialog = false;

    const index = this.prescriptions.findIndex(p => p.id === this.modifiedPrescription.id);
    if (index !== -1) {
      this.prescriptions[index] = { ...this.modifiedPrescription };
    }
  }

  // Consultation related function
  enregistrerConsultation() {
    // Implement your logic to save the consultation data here
    console.log('Consultation data:', this.newConsultation);

    // Reset the form after saving (optional)
    this.newConsultation = {
      nomPatient: '',
      codeCnam: '',
      descriptionMedicale: '',
      maladie: '',
      ordonnanceConcernee: '',
      prixConsultation: 0
    };
  }
}