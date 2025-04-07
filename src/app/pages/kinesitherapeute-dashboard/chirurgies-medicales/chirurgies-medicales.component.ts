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

interface Chirurgie {
  id?: number;
  date: Date | null;
  patient: string;
  medecin: string;
  type: string;
  description: string;
}

@Component({
  selector: 'app-chirurgies-medicales', // Corrected selector to match component name better
  templateUrl: './chirurgies-medicales.component.html',
  styleUrls: ['./chirurgies-medicales.component.css'],
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
export class ChirurgiesMedicalesComponent implements OnInit { // Renamed component class
  chirurgies: Chirurgie[] = [
    {
      id: 1,
      date: new Date(2023, 9, 20), // Example specific date
      patient: 'Jean Dupont',
      medecin: 'Dr. Martin',
      type: 'Appendicectomie',
      description: 'Chirurgie pour enlever l\'appendice inflammé. Suites opératoires simples.'
    },
    {
      id: 2,
      date: new Date(2023, 10, 5), // Example specific date
      patient: 'Marie Lambert',
      medecin: 'Dr. Bernard',
      type: 'Réparation de fracture',
      description: 'Ostéosynthèse par plaque et vis d\'une fracture du tibia distal gauche.'
    }
  ];

  dialogVisible: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  selectedChirurgie: Chirurgie | null = null;
  chirurgieForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.chirurgieForm = this.fb.group({
      patient: ['', Validators.required],
      date: [null, Validators.required],
      medecin: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ajouterChirurgie(): void {
    this.selectedChirurgie = null;
    this.viewMode = false;
    this.editMode = false;
    this.chirurgieForm.reset({ date: new Date() }); // Set default date
    this.chirurgieForm.enable(); // Ensure form is enabled
    this.dialogVisible = true;
  }

  voirChirurgie(chirurgie: Chirurgie): void {
    this.selectedChirurgie = { ...chirurgie };
    this.viewMode = true;
    this.editMode = false;
    // Ensure date is a Date object for the calendar
    const formDataToPatch = {
        ...chirurgie,
        date: chirurgie.date ? new Date(chirurgie.date) : null
    };
    this.chirurgieForm.patchValue(formDataToPatch);
    this.chirurgieForm.disable(); // Disable form in view mode
    this.dialogVisible = true;
  }

  modifierChirurgie(chirurgie: Chirurgie): void {
    this.selectedChirurgie = { ...chirurgie };
    this.viewMode = false;
    this.editMode = true;
    // Ensure date is a Date object for the calendar
    const formDataToPatch = {
        ...chirurgie,
        date: chirurgie.date ? new Date(chirurgie.date) : null
    };
    this.chirurgieForm.patchValue(formDataToPatch);
    this.chirurgieForm.enable(); // Ensure form is enabled
    this.dialogVisible = true;
  }

   supprimerChirurgie(chirurgie: Chirurgie): void {
    // *** Consider adding a confirmation dialog here (e.g., using PrimeNG ConfirmationService) ***
    console.log('Attempting to delete chirurgie:', chirurgie);
    this.chirurgies = this.chirurgies.filter(c => c.id !== chirurgie.id);
    console.log('Chirurgies after delete:', this.chirurgies);
    // Optional: Show success message (e.g., using PrimeNG Toast)
  }


  onDialogSave(): void {
    if (this.chirurgieForm.invalid) {
      this.chirurgieForm.markAllAsTouched(); // Show validation errors
      return;
    }

    const formData = this.chirurgieForm.getRawValue(); // Use getRawValue to get values even if disabled (though it shouldn't be disabled on save)

    if (this.editMode && this.selectedChirurgie) {
      // Update existing chirurgie
      const index = this.chirurgies.findIndex(c => c.id === this.selectedChirurgie!.id);
      if (index !== -1) {
        this.chirurgies[index] = { ...this.selectedChirurgie, ...formData };
      }
    } else {
      // Add new chirurgie
      const newChirurgie: Chirurgie = {
        id: this.generateNewId(),
        ...formData
      };
      this.chirurgies.push(newChirurgie);
    }
    this.dialogVisible = false;
    // Optional: Show success message
  }

  onDialogCancel(): void {
    this.dialogVisible = false;
  }

  getDialogHeader(): string {
      if (this.viewMode) {
          return 'Détails Chirurgie';
      } else if (this.editMode) {
          return 'Modifier Chirurgie';
      } else {
          return 'Nouvelle Chirurgie';
      }
  }

  private generateNewId(): number {
    return this.chirurgies.length > 0 ? Math.max(...this.chirurgies.map(c => c.id!)) + 1 : 1;
  }
}