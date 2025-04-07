import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { AppointmentService } from '../../services/appointment.service';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { Prescription, PrescriptionStatus } from '../../models/prescription';
import { Appointment } from '../../models/appointment';
import { MedicalHistory } from '../../models/medical-history';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
  standalone: true,

  imports: [CommonModule, DatePipe, RouterLink, TranslateModule]
})
export class PatientDashboardComponent implements OnInit {
  activePrescriptions: Prescription[] = [];
  upcomingAppointments: Appointment[] = [];
  medicalHistory: MedicalHistory[] = [];
  patientId!: number;
  loading = {
    prescriptions: false,
    appointments: false,
    history: false
  };
  error = {
    prescriptions: '',
    appointments: '',
    history: ''
  };

  constructor(
    private prescriptionService: PrescriptionService,
    private appointmentService: AppointmentService,
    private medicalHistoryService: MedicalHistoryService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  ngOnInit(): void {
    this.loadActivePrescriptions();
    this.loadUpcomingAppointments();
    this.loadMedicalHistory();
  }

  loadActivePrescriptions(): void {
    this.loading.prescriptions = true;
    this.error.prescriptions = '';
    
    this.prescriptionService.getActivePrescriptions().subscribe({
      next: (prescriptions: Prescription[]) => {
        this.activePrescriptions = prescriptions.map(prescription => ({
          ...prescription,
          date: prescription.dateCreation,
          statusClass: prescription.status === PrescriptionStatus.VALIDEE ? 'bg-success' : 'bg-warning',
          medications: prescription.contenu.split(','),
          doctorName: 'Pending' // This should be fetched from a doctor service
        }));
        this.loading.prescriptions = false;
      },
      error: (error: any) => {
        console.error('Error loading prescriptions:', error);
        this.error.prescriptions = this.translate.instant('errors.failedToLoadPrescriptions');
        this.loading.prescriptions = false;
      }
    });
  }

  loadUpcomingAppointments(): void {
    this.loading.appointments = true;
    this.error.appointments = '';

    this.appointmentService.getUpcomingAppointments().subscribe({
      next: (appointments) => {
        this.upcomingAppointments = appointments;
        this.loading.appointments = false;
      },
      error: (error: any) => {
        console.error('Error loading appointments:', error);
        this.error.appointments = this.translate.instant('errors.failedToLoadAppointments');
        this.loading.appointments = false;
      }
    });
  }

  loadMedicalHistory(): void {
    this.loading.history = true;
    this.error.history = '';

    this.medicalHistoryService.getHistory().subscribe({
      next: (history: MedicalHistory[]) => {
        this.medicalHistory = history.map((item: MedicalHistory) => ({
          ...item,
          type: item.diagnosis,
          description: item.treatment,
          doctorName: 'Nom du médecin',
          facility: 'Établissement médical',
          patientId: this.patientId
        }));
        this.loading.history = false;
      },
      error: (error: any) => {
        console.error('Error loading medical history:', error);
        this.error.history = this.translate.instant('errors.failedToLoadHistory');
        this.loading.history = false;
      }
    });
  }
}