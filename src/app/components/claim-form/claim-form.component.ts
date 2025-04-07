import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClaimService } from '../../services/claim.service';
import { RightsService } from '../../services/rights.service';

export interface PatientRights {
  remainingAmount: number;
}

@Component({
  selector: 'app-claim-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {


  claimForm: FormGroup;
  rights?: PatientRights;

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private rightsService: RightsService
  ) {
    this.claimForm = this.fb.group({
      patientName: ['', Validators.required],
      claimAmount: ['', [Validators.required, Validators.min(0)]],
      justification: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.loadRights();
  }

  loadRights(): void {
    this.rightsService.getPatientRights(1).subscribe({
      next: (rights) => this.rights = rights,
      error: (err) => console.error('Erreur chargement droits', err)
    });
  }

  onSubmit(): void {
    if (this.claimForm.valid) {
      this.claimService.submitClaim(this.claimForm.value).subscribe({
        next: () => alert('Réclamation soumise !'),
        error: (err) => console.error('Erreur soumission', err)
      });
    }
  }
}
