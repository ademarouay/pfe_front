import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';
import { PrimeNGModule } from '../../primeng.module';
import { TagModule } from 'primeng/tag';
import { InputTextarea } from 'primeng/inputtextarea';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  standalone: true,
  imports: [CommonModule, PrimeNGModule, TagModule, FormsModule, InputTextarea],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class AppointmentsComponent implements OnInit {
  minDate: Date = new Date();
  appointments: Appointment[] = [
    {
      id: 1,
      patientId: 101,
      patientName: 'Jean Dupont',
      doctorName: 'Dr. Smith',
      location: 'Cabinet 1',
      date: new Date(),
      time: '09:00',
      type: 'Consultation',
      status: 'scheduled',
      consultationCount: 3
    },
    {
      id: 2,
      patientId: 102,
      patientName: 'Marie Martin',
      doctorName: 'Dr. Smith',
      location: 'Cabinet 2',
      date: new Date(),
      time: '10:30',
      type: 'Suivi',
      status: 'scheduled',
      consultationCount: 1
    },
    {
      id: 3,
      patientId: 103,
      patientName: 'Sophie Bernard',
      doctorName: 'Dr. Smith',
      location: 'Cabinet 1',
      date: new Date(),
      time: '11:30',
      type: 'Urgence',
      status: 'scheduled',
      consultationCount: 0
    },
    {
      id: 4,
      patientId: 104,
      patientName: 'Lucas Petit',
      doctorName: 'Dr. Smith',
      location: 'Cabinet 2',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '09:30',
      type: 'Consultation',
      status: 'scheduled',
      consultationCount: 2
    },
    {
      id: 5,
      patientId: 105,
      patientName: 'Emma Roux',
      doctorName: 'Dr. Smith',
      location: 'Cabinet 1',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '11:00',
      type: 'Suivi',
      status: 'scheduled',
      consultationCount: 4
    }
  ];
  selectedDate: Date | null = null;
  todayAppointments: Appointment[] = [];
  tomorrowAppointments: Appointment[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  displayAppointmentDialog = false;
  displayDeleteConfirmation = false;
  isNewAppointment = true;
  appointmentForm: any = {};
  selectedAppointment: Appointment | null = null;
  patients: any[] = [];
  appointmentTypes: any[] = [
    { name: 'Consultation' },
    { name: 'Suivi' },
    { name: 'Urgence' }
  ];
  timeSlots: Array<{time: string, available: boolean}> = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '14:00', available: false },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: true }
  ];

  updateTimeSlots(): void {
    const selectedDateStr = this.selectedDate ? new Date(this.selectedDate).toDateString() : new Date().toDateString();
    const existingAppointments = this.appointments.filter(appointment => 
      new Date(appointment.date).toDateString() === selectedDateStr
    );

    this.timeSlots = this.timeSlots.map(slot => ({
      ...slot,
      available: !existingAppointments.some(appointment => appointment.time === slot.time)
    }));
  }

  calendarStyle = {
    'background-color': '#ffffff',
    'border-radius': '16px',
    'box-shadow': '0 4px 16px rgba(0,0,0,0.1)',
    'padding': '1.5rem'
  };

  constructor(private appointmentService: AppointmentService, private router: Router) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    // Using test data instead of service call
    this.appointments = this.appointments.map((appointment: Appointment) => ({
      ...appointment,
      statusClass: this.getStatusClass(appointment.status)
    }));
    this.totalItems = this.appointments.length;
    // Toujours charger les rendez-vous d'aujourd'hui et de demain
    this.filterTodayAppointments();
    this.filterTomorrowAppointments();
    // Ensuite, si une date est sélectionnée, filtrer pour cette date
    if (this.selectedDate) {
      this.filterAppointmentsByDate();
    }
  }

  filterAppointmentsByDate(): void {
    if (!this.selectedDate) return;
    const filterDate = new Date(this.selectedDate);
    this.todayAppointments = this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === filterDate.toDateString();
    });
  }

  filterTodayAppointments(): void {
    const today = new Date();
    this.todayAppointments = this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === today.toDateString();
    });
  }

  filterTomorrowAppointments(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.tomorrowAppointments = this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === tomorrow.toDateString();
    });
  }

  selectTimeSlot(slot: {time: string, available: boolean}): void {
    if (slot.available) {
      this.appointmentForm.time = slot.time;
      this.appointmentForm.date = this.selectedDate || new Date();
      this.showNewAppointmentDialog();
      this.loadAppointments();
    }
  }

  showNewAppointmentDialog(): void {
    this.isNewAppointment = true;
    this.appointmentForm = {};
    this.displayAppointmentDialog = true;
  }

  hideDialog(): void {
    this.displayAppointmentDialog = false;
    this.appointmentForm = {};
  }

  saveAppointment(): void {
    if (this.isNewAppointment) {
      this.appointmentService.createAppointment(this.appointmentForm).subscribe({
        next: () => {
          this.loadAppointments();
          this.updateTimeSlots();
          this.hideDialog();
          this.router.navigate(['/appointments']);
        },
        error: (error) => console.error('Error creating appointment:', error)
      });
    } else {
      this.appointmentService.updateAppointment(this.appointmentForm.id, this.appointmentForm).subscribe({
        next: () => {
          this.loadAppointments();
          this.updateTimeSlots();
          this.hideDialog();
          this.router.navigate(['/appointments']);
        },
        error: (error) => console.error('Error updating appointment:', error)
      });
    }
  }

  viewAppointment(appointment: Appointment): void {
    this.appointmentForm = { ...appointment };
    this.isNewAppointment = false;
    this.displayAppointmentDialog = true;
  }

  editAppointment(appointment: Appointment): void {
    this.appointmentForm = { ...appointment };
    this.isNewAppointment = false;
    this.displayAppointmentDialog = true;
  }

  deleteAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.displayDeleteConfirmation = true;
  }

  confirmDelete(): void {
    if (this.selectedAppointment?.id) {
      this.appointmentService.deleteAppointment(this.selectedAppointment.id).subscribe({
        next: () => {
          this.loadAppointments();
          this.displayDeleteConfirmation = false;
          this.selectedAppointment = null;
        },
        error: (error) => console.error('Error deleting appointment:', error)
      });
    }
  }

  cancelDelete(): void {
    this.displayDeleteConfirmation = false;
    this.selectedAppointment = null;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-success';
      case 'completed':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}