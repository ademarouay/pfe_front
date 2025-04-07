import { Routes } from '@angular/router';
import { HopitalisationDashboardComponent } from './hopitalisation-dashboard.component';
import { HopitalPatientsComponent } from './hopital-patients/hopital-patients.component';
import { HospitalisationConsultationComponent } from './consultation/hopitalisation-consultation.component';
import { ChirurgiesMedicalesComponent } from './chirurgies-medicales/chirurgies-medicales.component';
import { OrdonnancesHopitalComponent } from './ordonnances-hopital/ordonnances-hopital.component';
import { AdmissionPatientComponent } from './admission-patient/admission-patient.component';

export const HOPITALISATION_ROUTES: Routes = [
  {
    path: '',
    component: HopitalisationDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'admission',
        pathMatch: 'full'
      },
      {
        path: 'patients',
        component: HopitalPatientsComponent
      },
     
      {
        path: 'chirurgies',
        component: ChirurgiesMedicalesComponent
      },
      {
        path: 'consultation',
        component: HospitalisationConsultationComponent
      },
      {
        path: 'ordonnance',
        component: OrdonnancesHopitalComponent
      },
      {
        path: 'admission',
        component: AdmissionPatientComponent
      }
    ]
  }
];