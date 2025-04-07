import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChirurgiesMedicalesComponent } from './chirurgies-medicales.component';

const routes: Routes = [
  { path: '', component: ChirurgiesMedicalesComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChirurgiesMedicalesModule { }