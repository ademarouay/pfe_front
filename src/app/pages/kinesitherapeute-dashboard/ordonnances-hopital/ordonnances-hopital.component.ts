import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Explicit PrimeNG module imports if PrimeNGModule doesn't cover all
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeNGModule } from '../../../primeng.module'; // Assuming PrimeNGModule bundles these

interface Ordonnance {
  id?: number;
  date: Date | null;
  patient: string;
  medecin: string;
  medicaments: string;
  instructions?: string;
}

@Component({
  selector: 'app-ordonnances-hopital',
  templateUrl: './ordonnances-hopital.component.html',
  styleUrls: ['./ordonnances-hopital.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DatePipe,
    PrimeNGModule, // Keep if it bundles necessary modules
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
export class OrdonnancesHopitalComponent implements OnInit {
  ordonnances: Ordonnance[] = [
    {
      id: 1,
      date: new Date(2023, 10, 15),
      patient: 'Jean Dupont',
      medecin: 'Dr. Martin',
      medicaments: 'Paracétamol 1g - 3 fois/jour\nIbuprofène 400mg - 2 fois/jour si douleur intense',
      instructions: 'Prendre après les repas. Attention si antécédents gastriques.'
    },
    {
      id: 2,
      date: new Date(2023, 11, 1),
      patient: 'Marie Lambert',
      medecin: 'Dr. Bernard',
      medicaments: 'Amoxicilline 500mg - 1 gélule 3 fois/jour pendant 7 jours.',
      instructions: 'Terminer impérativement tout le traitement même si amélioration.'
    },
    {
        id: 3,
        date: new Date(2024, 0, 5), // Example date in 2024
        patient: 'Pierre Petit',
        medecin: 'Dr. Dubois',
        medicaments: 'Sérétide Diskus 50/250 - 1 inhalation matin et soir\nVentoline si besoin - 2 bouffées',
        instructions: 'Rincer la bouche après l\'inhalation de Sérétide.'
    }
  ];

  dialogVisible: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  selectedOrdonnance: Ordonnance | null = null;
  ordonnanceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ordonnanceForm = this.fb.group({
      patient: ['', Validators.required],
      date: [null, Validators.required],
      medecin: ['', Validators.required],
      medicaments: ['', Validators.required],
      instructions: [''] // Optional field
    });
  }

  ngOnInit(): void {}

  ajouterOrdonnance(): void {
    this.selectedOrdonnance = null;
    this.viewMode = false;
    this.editMode = false;
    this.ordonnanceForm.reset({ date: new Date() }); // Set default date
    this.ordonnanceForm.enable();
    this.dialogVisible = true;
  }

  voirOrdonnance(ordonnance: Ordonnance): void {
    this.selectedOrdonnance = { ...ordonnance };
    this.viewMode = true;
    this.editMode = false;
     // Ensure date is a Date object for the calendar
     const formDataToPatch = {
        ...ordonnance,
        date: ordonnance.date ? new Date(ordonnance.date) : null
    };
    this.ordonnanceForm.patchValue(formDataToPatch);
    this.ordonnanceForm.disable();
    this.dialogVisible = true;
  }

  modifierOrdonnance(ordonnance: Ordonnance): void {
    this.selectedOrdonnance = { ...ordonnance };
    this.viewMode = false;
    this.editMode = true;
    // Ensure date is a Date object when patching
    const formDataToPatch = {
        ...ordonnance,
        date: ordonnance.date ? new Date(ordonnance.date) : null
    };
    this.ordonnanceForm.patchValue(formDataToPatch);
    this.ordonnanceForm.enable();
    this.dialogVisible = true;
  }

  supprimerOrdonnance(ordonnance: Ordonnance): void {
    // *** Consider adding a confirmation dialog here (e.g., using PrimeNG ConfirmationService) ***
    console.log('Attempting to delete ordonnance:', ordonnance);
    this.ordonnances = this.ordonnances.filter(o => o.id !== ordonnance.id);
    console.log('Ordonnances after delete:', this.ordonnances);
    // Optional: Show success message
  }

  onDialogSave(): void {
    if (this.ordonnanceForm.invalid) {
      this.ordonnanceForm.markAllAsTouched(); // Show validation errors
      return; // Stop if form is invalid
    }

    const formData = this.ordonnanceForm.getRawValue(); // Use getRawValue to ensure all values (even disabled ones if logic changed) are captured

    if (this.editMode && this.selectedOrdonnance) {
      const index = this.ordonnances.findIndex(o => o.id === this.selectedOrdonnance!.id);
      if (index !== -1) {
        this.ordonnances[index] = { ...this.selectedOrdonnance, ...formData };
      }
    } else {
      const newOrdonnance: Ordonnance = {
        id: this.generateNewId(),
        ...formData
      };
      this.ordonnances.push(newOrdonnance);
    }
    this.dialogVisible = false;
    // Optional: Show success message
  }

  onDialogCancel(): void {
    this.dialogVisible = false;
  }

  private generateNewId(): number {
    return this.ordonnances.length > 0 ? Math.max(...this.ordonnances.map(o => o.id!)) + 1 : 1;
  }

  getDialogHeader(): string {
      if (this.viewMode) {
          return 'Détails Ordonnance';
      } else if (this.editMode) {
          return 'Modifier Ordonnance';
      } else {
          return 'Nouvelle Ordonnance';
      }
  }
}