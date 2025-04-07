import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

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

interface Statistic {
  title: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-cnam-dashboard',
  templateUrl: './cnam-dashboard.component.html',
  styleUrls: ['./cnam-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe]
})
export class CnamDashboardComponent implements OnInit {
  pendingPrescriptionsCount: number = 0;
  processedReimbursementsCount: number = 0;
  totalReimbursementAmount: number = 0;
  
  pendingPrescriptions: PendingPrescription[] = [];
  recentReimbursements: Reimbursement[] = [];
  statistics: Statistic[] = [];
  
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

  constructor() {}

  ngOnInit(): void {
    this.loadPendingPrescriptions();
    this.loadRecentReimbursements();
    // Initialize statistics with mock data
    this.statistics = [
      {
        title: 'Pending Prescriptions',
        count: this.pendingPrescriptionsCount,
        amount: 0,
        percentage: 30,
        color: 'bg-warning'
      },
      {
        title: 'Processed Reimbursements',
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
      this.pendingPrescriptions = [
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
}
