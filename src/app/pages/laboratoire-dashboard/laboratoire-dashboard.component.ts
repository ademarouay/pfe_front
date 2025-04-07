import { Component, OnInit } from '@angular/core';
import { CommonModule,  CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


interface Patient {
  patientCodeCnam: number;
  patientName: string;
}

interface Ordonnance {
  patientCodeCnam: number;
  medications: string[];
  tests: string[];
}

interface InvoiceItem {
  patientCodeCnam: number | null; // Ajout du code CNAM
  medications: string;
  tests: string;
  price: number;
  fromPrescription: boolean;
}

@Component({
  selector: 'app-laboratoire',
  templateUrl: './laboratoire-dashboard.component.html',
  styleUrls: ['./laboratoire-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,  RouterModule],
})
export class LaboratoireComponent implements OnInit {
  searchCodeCnam: number | null = null;
  foundPatient: Patient | null = null;
  foundOrdonnance: Ordonnance | null = null;
  invoiceItems: InvoiceItem[] = [];
  newInvoiceItem: InvoiceItem = { patientCodeCnam: null, medications: '', tests: '', price: 0, fromPrescription: false }; // Initialisation du code CNAM

  patients: Patient[] = [
    { patientCodeCnam: 123456, patientName: 'John Doe' },
    { patientCodeCnam: 654321, patientName: 'Jane Smith' },
    { patientCodeCnam: 987654, patientName: 'Alice Johnson' },
    { patientCodeCnam: 112233, patientName: 'Bob Miller' },
  ];

  ordonnances: Ordonnance[] = [
    { patientCodeCnam: 123456, medications: ['Paracetamol', 'Ibuprofen'], tests: ['Blood test', 'X-ray'] },
    { patientCodeCnam: 654321, medications: ['Amoxicillin'], tests: ['Urine test'] },
    { patientCodeCnam: 987654, medications: ['Lisinopril', 'Aspirin'], tests: ['ECG'] },
    { patientCodeCnam: 112233, medications: ['Metformin'], tests: ['Glucose test'] },
  ];

  ngOnInit(): void {}

  searchPatient(): void {
    if (this.searchCodeCnam) {
      this.foundPatient = this.patients.find((p) => p.patientCodeCnam === this.searchCodeCnam) || null;
      this.foundOrdonnance = this.ordonnances.find((o) => o.patientCodeCnam === this.searchCodeCnam) || null;
      if (this.foundOrdonnance) {
        this.newInvoiceItem.patientCodeCnam = this.foundOrdonnance.patientCodeCnam; // Transfert du code CNAM
        this.newInvoiceItem.tests = this.foundOrdonnance.tests.join(', ');
      } else {
        this.newInvoiceItem.patientCodeCnam = null;
      }
    }
  }

  addMedicationToInvoice(medication: string): void {
    if (this.newInvoiceItem.medications) {
      this.newInvoiceItem.medications += ', ' + medication;
    } else {
      this.newInvoiceItem.medications = medication;
    }
  }

  addTestToInvoice(test: string): void {
    if (this.newInvoiceItem.tests) {
      this.newInvoiceItem.tests += ', ' + test;
    } else {
      this.newInvoiceItem.tests = test;
    }
  }

  addInvoiceItem(): void {
    this.invoiceItems.push({ ...this.newInvoiceItem });
    this.newInvoiceItem = { patientCodeCnam: this.newInvoiceItem.patientCodeCnam, medications: '', tests: '', price: 0, fromPrescription: false }; // Conservation du code CNAM
  }

  createInvoice(): void {
    console.log('Creating invoice:', this.invoiceItems);
    this.invoiceItems = [];
    this.newInvoiceItem = { patientCodeCnam: null, medications: '', tests: '', price: 0, fromPrescription: false }; // Réinitialisation du code CNAM
    this.searchCodeCnam = null;
  }
}