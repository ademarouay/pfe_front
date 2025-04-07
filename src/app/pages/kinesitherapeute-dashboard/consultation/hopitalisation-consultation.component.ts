import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimeNGModule } from '../../../primeng.module'; // Assuming PrimeNGModule bundles Table, Dialog etc.
import { RouterModule } from '@angular/router';

// Explicit PrimeNG module imports if PrimeNGModule doesn't cover all
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

interface Consultation {
  id?: number;
  date: Date | null;
  patient: string;
  medecin: string;
  diagnostic: string;
  traitement: string;
}

@Component({
  selector: 'app-hopitalisation-consultation',
  templateUrl: './hopitalisation-consultation.component.html',
  styleUrls: ['./hopitalisation-consultation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule, // Keep if it bundles necessary modules
    RouterModule,
    DatePipe,
    // Explicit imports ensure modules are available
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    CalendarModule,
    TooltipModule
  ]
})
export class HospitalisationConsultationComponent implements OnInit {
  consultations: Consultation[] = [
    {
      id: 1,
      date: new Date(2023, 10, 10), // Example specific date
      patient: 'Jean Dupont',
      medecin: 'Dr. Martin',
      diagnostic: 'Grippe saisonnière',
      traitement: 'Repos à domicile, antipyrétiques (Paracétamol 1g max 4/j), hydratation.'
    },
    {
      id: 2,
      date: new Date(2023, 10, 25), // Example specific date
      patient: 'Marie Lambert',
      medecin: 'Dr. Bernard',
      diagnostic: 'Entorse cheville gauche stade II',
      traitement: 'Immobilisation par attelle Aircast, AINS (Ibuprofène 400mg 3/j), cryothérapie, repos relatif.'
    }
  ];

  dialogVisible: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  selectedConsultation: Consultation | null = null;
  consultationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.consultationForm = this.fb.group({
      patient: ['', Validators.required],
      date: [null, Validators.required],
      medecin: ['', Validators.required],
      diagnostic: ['', Validators.required],
      traitement: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ajouterConsultation(): void {
    this.selectedConsultation = null;
    this.viewMode = false;
    this.editMode = false;
    this.consultationForm.reset({ date: new Date() }); // Set default date
    this.consultationForm.enable();
    this.dialogVisible = true;
  }

  voirConsultation(consultation: Consultation): void {
    this.selectedConsultation = { ...consultation };
    this.viewMode = true;
    this.editMode = false;
    // Ensure date is a Date object for the calendar
    const formDataToPatch = {
        ...consultation,
        date: consultation.date ? new Date(consultation.date) : null
    };
    this.consultationForm.patchValue(formDataToPatch);
    this.consultationForm.disable();
    this.dialogVisible = true;
  }

  modifierConsultation(consultation: Consultation): void {
    this.selectedConsultation = { ...consultation };
    this.viewMode = false;
    this.editMode = true;
     // Ensure date is a Date object for the calendar
     const formDataToPatch = {
        ...consultation,
        date: consultation.date ? new Date(consultation.date) : null
    };
    this.consultationForm.patchValue(formDataToPatch);
    this.consultationForm.enable();
    this.dialogVisible = true;
  }

  supprimerConsultation(consultation: Consultation): void {
    // *** Consider adding a confirmation dialog here (e.g., using PrimeNG ConfirmationService) ***
    console.log('Attempting to delete consultation:', consultation);
    this.consultations = this.consultations.filter(c => c.id !== consultation.id);
    console.log('Consultations after delete:', this.consultations);
    // Optional: Show success message
  }

  onDialogSave(): void {
    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    const formData = this.consultationForm.getRawValue();

    if (this.editMode && this.selectedConsultation) {
      // Update existing consultation
      const index = this.consultations.findIndex(c => c.id === this.selectedConsultation!.id);
      if (index !== -1) {
        this.consultations[index] = { ...this.selectedConsultation, ...formData };
      }
    } else {
      // Add new consultation
      const newConsultation: Consultation = {
        id: this.generateNewId(),
        ...formData
      };
      this.consultations.push(newConsultation);
    }
    this.dialogVisible = false;
    // Optional: Show success message
  }

  onDialogCancel(): void {
    this.dialogVisible = false;
  }

  getDialogHeader(): string {
    if (this.viewMode) {
      return 'Détails Consultation';
    } else if (this.editMode) {
      return 'Modifier Consultation';
    } else {
      return 'Nouvelle Consultation';
    }
  }

  private generateNewId(): number {
    return this.consultations.length > 0 ? Math.max(...this.consultations.map(c => c.id!)) + 1 : 1;
  }
}