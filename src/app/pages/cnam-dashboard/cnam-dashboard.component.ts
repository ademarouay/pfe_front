import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Statistic } from '../../models/statistic.interface';

interface PendingPrescription {
  id: number;
  reference: string;
  patientName: string;
  patientCodeCnam: number;
  doctorName: string;
  type: string;
  creationDate: Date;
}

interface Reimbursement {
  id: number;
  reference: string;
  patientName: string;
  patientCodeCnam: number;
  amount: number;
  date: Date;
  status: string;
  statusClass: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface LaboratoryInvoice {
  laboratoryName: string;
  date: Date;
  amount: number;
  invoiceNumber: string;
}

interface PharmacyInvoice {
  pharmacyName: string;
  date: Date;
  amount: number;
  invoiceNumber: string;
}

interface CeilingRequest {
  date: Date;
  patientName: string;
  status: string;
  statusClass: string;
}

@Component({
  selector: 'app-cnam-dashboard',
  templateUrl: './cnam-dashboard.component.html',
  styleUrls: ['./cnam-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,  DatePipe, CurrencyPipe]
})
export class CnamDashboardComponent implements OnInit {
  // Filtres
  filterDoctorName: string = '';
  filterPatientName: string = '';
  filterPharmacyName: string = '';

  // Compteurs
  pendingPrescriptionsCount: number = 0;
  processedReimbursementsCount: number = 0;
  totalReimbursementAmount: number = 0;

  // États de chargement et erreurs
  loading = {
    pendingPrescriptions: false,
    recentReimbursements: false,
    statistics: false
  };

  error = {
    pendingPrescriptions: '',
    recentReimbursements: '',
    statistics: ''
  };

  // Données
  pendingPrescriptions: PendingPrescription[] = [];
  recentReimbursements: Reimbursement[] = [];
  statistics: Statistic[] = [];
  ceilingRequests: CeilingRequest[] = [];

  // Propriétés pour le plafond
  currentCeiling: number = 0;
  requestedCeiling: number = 0;
  status: string = '';
  statusClass: string = '';

  constructor() {}

  approveReimbursement(id: number) {
    // Trouver le remboursement à approuver
    const reimbursement = this.recentReimbursements.find(r => r.id === id);
    if (reimbursement) {
      // Mettre à jour le statut
      reimbursement.status = 'Approuvé';
      reimbursement.statusClass = 'status-approved';

      // Mettre à jour les compteurs
      this.processedReimbursementsCount++;
      this.totalReimbursementAmount += reimbursement.amount;
    }
  }

  // Méthode pour rejeter un remboursement
  rejectReimbursement(id: number): void {
    const reimbursement = this.recentReimbursements.find(r => r.id === id);
    if (reimbursement) {
      reimbursement.status = 'Rejeté';
      reimbursement.statusClass = 'status-rejected';
      // Ici, vous pouvez ajouter l'appel au service pour mettre à jour le statut dans la base de données
    }
  }

  ngOnInit(): void {
    this.loadPendingPrescriptions();
    this.loadRecentReimbursements();
    this.initializeStatistics();
  }

  public initializeStatistics(): void {
    this.statistics = [
      {
        title: 'Ordonnances en attente',
        count: this.pendingPrescriptionsCount,
        amount: 0,
        percentage: 30,
        color: 'bg-warning'
      },
      {
        title: 'Remboursements traités',
        count: this.processedReimbursementsCount,
        amount: this.totalReimbursementAmount,
        percentage: 70,
        color: 'bg-success'
      }
    ];
  }

  loadPendingPrescriptions(): void {
    this.loading.pendingPrescriptions = true;
    this.error.pendingPrescriptions = '';

    // Simulate API call with mock data
    setTimeout(() => {
      const allPrescriptions = [
        {
          id: 1,
          reference: 'PRES-2023-001',
          patientName: 'Ahmed Ben Ali',
          patientCodeCnam: 12345678,
          doctorName: 'Dr. Mehdi Khelifi',
          type: 'Médicament',
          creationDate: new Date(Date.now() - 86400000) // 1 day ago
        },
        {
          id: 2,
          reference: 'PRES-2023-002',
          patientName: 'Fatma Trabelsi',
          patientCodeCnam: 87654321,
          doctorName: 'Dr. Leila Mansour',
          type: 'Examen',
          creationDate: new Date(Date.now() - 172800000) // 2 days ago
        },
        {
          id: 3,
          reference: 'PRES-2023-003',
          patientName: 'Mohamed Sassi',
          patientCodeCnam: 23456789,
          doctorName: 'Dr. Karim Bouzid',
          type: 'Hospitalisation',
          creationDate: new Date(Date.now() - 259200000) // 3 days ago
        },
      ];
      // Appliquer les filtres aux prescriptions
      this.pendingPrescriptions = this.filterPrescriptions();
      this.pendingPrescriptionsCount = this.pendingPrescriptions.length;
      this.loading.pendingPrescriptions = false;
    }, 1000);
  }

  loadRecentReimbursements(): void {
    this.loading.recentReimbursements = true;
    this.error.recentReimbursements = '';

    // Simulate API call with mock data
    setTimeout(() => {
      this.recentReimbursements = [
        {
          id: 1,
          reference: 'REMB-2023-001',
          patientName: 'Sami Mejri',
          patientCodeCnam: 34567890,
          amount: 120.50,
          date: new Date(Date.now() - 43200000), // 12 hours ago
          status: 'Approuvé',
          statusClass: 'bg-success text-white'
        },
        {
          id: 2,
          reference: 'REMB-2023-002',
          patientName: 'Nadia Belhadj',
          patientCodeCnam: 45678901,
          amount: 75.25,
          date: new Date(Date.now() - 86400000), // 1 day ago
          status: 'En traitement',
          statusClass: 'bg-warning text-dark'
        },
        {
          id: 3,
          reference: 'REMB-2023-003',
          patientName: 'Riadh Jebali',
          patientCodeCnam: 56789012,
          amount: 250.00,
          date: new Date(Date.now() - 129600000), // 1.5 days ago
          status: 'Approuvé',
          statusClass: 'bg-success text-white'
        }
      ];
      this.processedReimbursementsCount = this.recentReimbursements.filter(r => r.status === 'Approuvé').length;
      this.totalReimbursementAmount = this.recentReimbursements
        .filter(r => r.status === 'Approuvé')
        .reduce((sum, r) => sum + r.amount, 0);
      this.loading.recentReimbursements = false;
    }, 1000);
  }

  // Méthodes pour gérer les demandes de plafond
  approveCeilingRequest(request: CeilingRequest): void {
    request.status = 'APPROUVÉ';
    request.statusClass = 'bg-success';
  }

  rejectCeilingRequest(request: CeilingRequest): void {
    request.status = 'REJETÉ';
    request.statusClass = 'bg-danger';
  }

  onFilterChange(): void {
    this.loadPendingPrescriptions();
  }

  // Méthode pour filtrer les ordonnances
  filterPrescriptions(): PendingPrescription[] {
    return this.pendingPrescriptions.filter(prescription => {
      const matchDoctor = this.filterDoctorName ?
        prescription.doctorName.toLowerCase().includes(this.filterDoctorName.toLowerCase()) : true;
      const matchPatient = this.filterPatientName ?
        prescription.patientName.toLowerCase().includes(this.filterPatientName.toLowerCase()) : true;
      return matchDoctor && matchPatient;
    });
  }
}