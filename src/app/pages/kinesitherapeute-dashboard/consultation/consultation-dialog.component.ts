import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-consultation-dialog',
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
      header="Nouvelle Consultation"
      styleClass="modern-dialog"
    >
      <form [formGroup]="consultationForm" class="p-fluid">
        <div class="field mb-4">
          <label for="patient" class="block font-medium mb-2">Patient</label>
          <input pInputText id="patient" formControlName="patient" placeholder="Nom du patient" class="w-full" />
        </div>

        <div class="field mb-4">
          <label for="date" class="block font-medium mb-2">Date</label>
          <p-calendar id="date" formControlName="date" [showIcon]="true" dateFormat="dd/mm/yy" class="w-full"></p-calendar>
        </div>

        <div class="field mb-4">
          <label for="diagnostic" class="block font-medium mb-2">Diagnostic</label>
          <textarea pInputTextarea id="diagnostic" formControlName="diagnostic" rows="3" class="w-full"></textarea>
        </div>

        <div class="field mb-4">
          <label for="traitement" class="block font-medium mb-2">Traitement</label>
          <textarea pInputTextarea id="traitement" formControlName="traitement" rows="3" class="w-full"></textarea>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
          <p-button label="Annuler" icon="pi pi-times" (click)="onCancel()" styleClass="p-button-text"></p-button>
          <p-button label="Enregistrer" icon="pi pi-check" (click)="onSave()" [disabled]="!consultationForm.valid" styleClass="p-button-success"></p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .modern-dialog .p-dialog-header {
      background: #374151;
      color: white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      padding: 1.25rem 1.5rem;
      font-weight: 600;
    }

    :host ::ng-deep .modern-dialog .p-dialog-content {
      padding: 2.5rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    :host ::ng-deep .modern-dialog .p-dialog-footer {
      padding: 1.5rem;
      background: #f3f4f6;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      display: flex;
      justify-content: flex-end;
    }

    :host ::ng-deep .modern-dialog .p-dialog {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    :host ::ng-deep .modern-dialog .p-inputtext,
    :host ::ng-deep .modern-dialog .p-calendar,
    :host ::ng-deep .modern-dialog .p-inputtextarea {
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 0.75rem;
      transition: border-color 0.3s ease;
    }

    :host ::ng-deep .modern-dialog .p-inputtext:focus,
    :host ::ng-deep .modern-dialog .p-calendar:focus,
    :host ::ng-deep .modern-dialog .p-inputtextarea:focus {
      border-color: #6b7280;
      box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    CalendarModule
  ]
})
export class ConsultationDialogComponent {
  @Input() visible: boolean = false;
  @Input() viewMode: boolean = false;
  @Input() editMode: boolean = false;
  @Input() selectedConsultation: any = null;
  consultationForm: FormGroup;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.consultationForm = this.fb.group({
      patient: ['', Validators.required],
      date: [new Date(), Validators.required],
      diagnostic: ['', Validators.required],
      traitement: ['', Validators.required]
    });
  }

  show() {
    this.visible = true;
  }

  onCancel() {
    this.visible = false;
    this.consultationForm.reset();
    this.cancelled.emit();
  }

  onSave() {
    if (this.consultationForm.valid) {
      this.saved.emit(this.consultationForm.value);
      this.visible = false;
      this.consultationForm.reset();
    }
  }
}