import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription, PrescriptionStatus } from '../../models/prescription';
import { FormsModule } from '@angular/forms';

interface PendingPrescription {
  id: number;
  patientName: string;
  patientCodeCnam: number;
  date: Date;
  medications: string[];
  doctorName: string;
}

interface InventoryItem {
  name: string;
  quantity: number;
  minStock: number;
  description: string;
}

interface Transaction {
  date: Date;
  patientName: string;
  medicationCount: number;
  total: number;
  status: string;
  statusClass: string;
}

interface InvoiceItem {
  medications: string;
  quantity: number;
  price: number;
  fromPrescription: boolean;
  patientCodeCnam: number | null;
}

@Component({
  selector: 'app-pharmacien-dashboard',
  templateUrl: './pharmacien-dashboard.component.html',
  styleUrls: ['./pharmacien-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink, FormsModule],
})
export class PharmacienDashboardComponent implements OnInit {
  pendingPrescriptions: PendingPrescription[] = [];
  recentTransactions: Transaction[] = [];
  loading = {
    prescriptions: false,
    transactions: false,
  };
  error = {
    prescriptions: '',
    transactions: '',
  };
  searchCodeCnam: number | null = null;
  foundPrescription: PendingPrescription | null = null;
  invoiceItems: InvoiceItem[] = [];
  newInvoiceItem: InvoiceItem = { medications: '', quantity: 1, price: 0, fromPrescription: false, patientCodeCnam: null };
  paymentMethod: 'CNAM' | 'Direct' = 'Direct';

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    this.loadTestData();
    this.loadRecentTransactions();
  }

  loadTestData(): void {
    this.pendingPrescriptions = [
      {
        id: 1,
        patientName: 'John Doe',
        patientCodeCnam: 123456,
        date: new Date(),
        medications: ['Paracetamol', 'Ibuprofen'],
        doctorName: 'Dr. Smith',
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        patientCodeCnam: 654321,
        date: new Date(Date.now() - 86400000),
        medications: ['Amoxicillin'],
        doctorName: 'Dr. Johnson',
      },
      {
        id: 3,
        patientName: 'Alice Johnson',
        patientCodeCnam: 987654,
        date: new Date(Date.now() - 172800000),
        medications: ['Lisinopril', 'Aspirin'],
        doctorName: 'Dr. Williams',
      },
      {
        id: 4,
        patientName: 'Bob Miller',
        patientCodeCnam: 112233,
        date: new Date(Date.now() - 259200000),
        medications: ['Metformin'],
        doctorName: 'Dr. Davis',
      },
    ];
  }

  searchPrescription(): void {
    if (this.searchCodeCnam) {
      this.loading.prescriptions = true;
      this.error.prescriptions = '';

      const found = this.pendingPrescriptions.find((p) => p.patientCodeCnam === this.searchCodeCnam);
      if (found) {
        this.foundPrescription = found;
        this.newInvoiceItem.patientCodeCnam = found.patientCodeCnam;
      } else {
        this.foundPrescription = null;
        this.newInvoiceItem.patientCodeCnam = null;
        this.error.prescriptions = 'Ordonnance non trouvée pour ce code CNAM.';
      }
      this.loading.prescriptions = false;
    }
  }

  validatePrescription(): void {
    if (this.foundPrescription) {
      console.log(`Validating prescription ${this.foundPrescription.id}`);
      this.foundPrescription = null;
      this.searchCodeCnam = null;
    }
  }

  addInvoiceItem(): void {
    this.invoiceItems.push({ ...this.newInvoiceItem });
    this.newInvoiceItem = { medications: '', quantity: 1, price: 0, fromPrescription: false, patientCodeCnam: this.newInvoiceItem.patientCodeCnam };
  }

  createInvoice(): void {
    console.log('Creating invoice:', this.invoiceItems, 'Payment:', this.paymentMethod);
    this.invoiceItems = [];
    this.newInvoiceItem = { medications: '', quantity: 1, price: 0, fromPrescription: false, patientCodeCnam: null };
    this.searchCodeCnam = null;
  }

  loadRecentTransactions(): void {
    this.loading.transactions = true;
    this.error.transactions = '';

    setTimeout(() => {
      try {
        this.recentTransactions = [
          {
            date: new Date(),
            patientName: 'Jane Smith',
            medicationCount: 3,
            total: 45.99,
            status: 'Completed',
            statusClass: 'bg-success',
          },
          {
            date: new Date(Date.now() - 86400000),
            patientName: 'John Doe',
            medicationCount: 2,
            total: 32.50,
            status: 'Completed',
            statusClass: 'bg-success',
          },
          {
            date: new Date(Date.now() - 172800000),
            patientName: 'Alice Johnson',
            medicationCount: 1,
            total: 15.75,
            status: 'Pending',
            statusClass: 'bg-warning',
          },
        ];
        this.loading.transactions = false;
      } catch (error) {
        console.error('Error loading transactions:', error);
        this.error.transactions = 'Failed to load transactions';
        this.loading.transactions = false;
      }
    }, 1000);
  }

  addMedicationToInvoice(medication: string): void {
    if (this.newInvoiceItem.medications) {
      this.newInvoiceItem.medications += ', ' + medication;
    } else {
      this.newInvoiceItem.medications = medication;
    }
  }
}