import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaboratoireComponent } from './laboratoire-dashboard.component';
import { PatientLaboComponent } from './patient-labo/patient-labo.component';
import { TestLaboComponent } from './test-labo/test-labo.component';
import { FactureLaboComponent } from './facture-labo/facture-labo.component';
import { PrimeNGModule } from '../../primeng.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PrimeNGModule,
    LaboratoireComponent,
    PatientLaboComponent,
    TestLaboComponent,
    FactureLaboComponent
  ],
  declarations: []
})
export class LaboratoireDashboardModule { }