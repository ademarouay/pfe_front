import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PreinscriptionComponent } from './components/preinscription/preinscription.component';
import { EmailTestComponent } from './components/email-test/email-test.component';
import { HomeComponent } from './components/home/home.component';
import { PatientDashboardComponent } from './pages/patient-dashboard/patient-dashboard.component';
import { PharmacienDashboardComponent } from './pages/pharmacien-dashboard/pharmacien-dashboard.component';
import { CnamDashboardComponent } from './pages/cnam-dashboard/cnam-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component'; 
import { RemboursementCnamComponent } from './remboursement-cnam/remboursement-cnam.component';
import { HOPITALISATION_ROUTES } from './pages/kinesitherapeute-dashboard/hopitalisation-dashboard.routes';
import { MEDECIN_ROUTES } from './pages/medecin-dashboard/medecin-dashboard.routes';
import { LABORATOIRE_ROUTES } from './pages/laboratoire-dashboard/laboratoire-dashboard.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'preinscription', component: PreinscriptionComponent },
  { path: 'home', component: HomeComponent },
  { path: 'remboursement-cnam', component: RemboursementCnamComponent },
  
  // Patient routes
  {
    path: 'patient-dashboard',
    component: PatientDashboardComponent,
    children: [
      { path: 'mes-ordonnances', component: PatientDashboardComponent },
      { path: 'mes-rendez-vous', component: PatientDashboardComponent },
      { path: 'mon-historique', component: PatientDashboardComponent }
    ]
  },
  
  // Medecin routes
  { path: 'medecin-dashboard', children: MEDECIN_ROUTES },

  // Pharmacist routes
  { path: 'pharmacien-dashboard', component: PharmacienDashboardComponent },

  // Laboratory routes
  { path: 'laboratoire-dashboard', children: LABORATOIRE_ROUTES },

  // Hopitalisation routes
  { path: 'hopitalisation-dashboard', children: HOPITALISATION_ROUTES },
  
  // CNAM routes
  {
    path: 'cnam-dashboard',
    component: CnamDashboardComponent,
    children: [
      { path: 'reimbursements', component: CnamDashboardComponent },
      { path: 'prescriptions', component: CnamDashboardComponent }
    ]
  },

  // Common routes
  { path: 'profile', component: ProfileComponent },
  { path: 'test-email', component: EmailTestComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

