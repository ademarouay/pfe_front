import { Routes } from '@angular/router';
import { MedecinDashboardComponent } from './medecin-dashboard.component';
import { PatientManagementComponent } from './patient-management/patient-management.component';
import { PrescriptionManagementComponent } from './prescription-management/prescription-management.component';
import { DemandePlafondComponent } from './demande-plafond/demande-plafond.component';

export const MEDECIN_ROUTES: Routes = [
  {
    path: '',
    component: MedecinDashboardComponent
  },
  {
    path: 'patients',
    component: PatientManagementComponent
  },
  
  {
    path: 'prescriptions',
    component: PrescriptionManagementComponent
  },
 
  {
    path: 'demande-plafond',
    component: DemandePlafondComponent
  }
];