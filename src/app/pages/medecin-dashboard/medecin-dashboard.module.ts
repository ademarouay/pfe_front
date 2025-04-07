import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MedecinDashboardComponent } from './medecin-dashboard.component';
import { PatientManagementComponent } from './patient-management/patient-management.component';
import { PrescriptionManagementComponent } from './prescription-management/prescription-management.component';
import { DemandePlafondComponent } from './demande-plafond/demande-plafond.component';
import { MEDECIN_ROUTES } from './medecin-dashboard.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(MEDECIN_ROUTES),
    TranslateModule,
    MedecinDashboardComponent,
    PatientManagementComponent,
    PrescriptionManagementComponent,
    DemandePlafondComponent
  ],
  exports: [RouterModule]
})
export class MedecinDashboardModule { }