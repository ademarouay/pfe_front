// medecin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { PrescriptionService } from '../../services/prescription.service';
import { Appointment } from '../../models/appointment';
import { Prescription } from '../../models/prescription';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Patient {
  id: number;
  codeCnam: number;
  name: string;
  lastVisit: Date;
}

@Component({
  selector: 'app-medecin-dashboard',
  templateUrl: './medecin-dashboard.component.html',
  styleUrls: ['./medecin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TranslateModule],
})
export class MedecinDashboardComponent implements OnInit {
  todayAppointments: Appointment[] = [];
  recentPrescriptions: Prescription[] = [];
  recentPatients: Patient[] = [];
  loading = {
    appointments: false,
    prescriptions: false,
    patients: false,
  };
  error = {
    appointments: '',
    prescriptions: '',
    patients: '',
  };

  constructor(
    private appointmentService: AppointmentService,
    private prescriptionService: PrescriptionService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  ngOnInit(): void {
    this.loadTodayAppointments();
    this.loadRecentPrescriptions();
    this.loadRecentPatients();
  }

  loadTodayAppointments(): void {
    this.loading.appointments = true;
    this.error.appointments = '';

    this.appointmentService.getUpcomingAppointments().subscribe({
      next: (appointments) => {
        // Filter for today's appointments in a real app
        this.todayAppointments = appointments;
        this.loading.appointments = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.error.appointments = error.message || this.translate.instant('errors.failedToLoadAppointments');
        this.loading.appointments = false;
      },
    });
  }

  loadRecentPrescriptions(): void {
    this.loading.prescriptions = true;
    this.error.prescriptions = '';

    this.prescriptionService.getPrescriptionsByPrescriber(1).subscribe({
      // Replace 1 with actual doctor ID
      next: (prescriptions) => {
        this.recentPrescriptions = prescriptions;
        this.loading.prescriptions = false;
      },
      error: (error) => {
        console.error('Error loading prescriptions:', error);
        this.error.prescriptions = error.message || this.translate.instant('errors.failedToLoadPrescriptions');
        this.loading.prescriptions = false;
      },
    });
  }

  loadRecentPatients(): void {
    this.loading.patients = true;
    this.error.patients = '';

    // TODO: Replace with actual service call when patient service is implemented
    setTimeout(() => {
      try {
        this.recentPatients = [
          {
            id: 1,
            codeCnam: 12345678,
            name: 'John Doe',
            lastVisit: new Date(Date.now() - 7 * 86400000), // 7 days ago
          },
          {
            id: 2,
            codeCnam: 87654321,
            name: 'Jane Smith',
            lastVisit: new Date(Date.now() - 14 * 86400000), // 14 days ago
          },
          {
            id: 3,
            codeCnam: 13579246,
            name: 'Alice Johnson',
            lastVisit: new Date(Date.now() - 21 * 86400000), // 21 days ago
          },
        ];
        this.loading.patients = false;
      } catch (error) {
        console.error('Error loading patients:', error);
        this.error.patients = this.translate.instant('errors.failedToLoadPatients');
        this.loading.patients = false;
      }
    }, 1000);
  }

  createNewPrescription(): void {
    // This would navigate to a prescription creation form
    this.router.navigate(['/medecin-dashboard/prescriptions/new']);
  }

  viewPatientDetails(patientId: number): void {
    // This would navigate to patient details
    this.router.navigate(['/medecin-dashboard/patients', patientId]);
  }

  scheduleAppointment(): void {
    // This would navigate to appointment scheduling form
    this.router.navigate(['/medecin-dashboard/appointments/new']);
  }
}