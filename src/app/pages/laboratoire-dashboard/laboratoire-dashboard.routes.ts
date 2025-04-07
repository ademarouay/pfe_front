import { Routes } from '@angular/router';
import { LaboratoireComponent } from './laboratoire-dashboard.component'; // The component containing the <router-outlet> for children
import { PatientLaboComponent } from './patient-labo/patient-labo.component';
import { TestLaboComponent } from './test-labo/test-labo.component';
import { FactureLaboComponent } from './facture-labo/facture-labo.component';

export const LABORATOIRE_ROUTES: Routes = [
  {
    path: '',
    component: LaboratoireComponent,
    children: [
      {
        path: '',
        redirectTo: 'tests',
        pathMatch: 'full'
      },
      {
        path: 'patients',
        component: PatientLaboComponent
      },
      {
        path: 'tests',
        component: TestLaboComponent
      },
      {
        path: 'facture',
        component: FactureLaboComponent
      }
    ]
  }
];