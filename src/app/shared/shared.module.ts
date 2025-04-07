import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from '../components/home/home.component';
import { AuthComponent } from '../components/auth/auth.component';
import { EmailTestComponent } from '../components/email-test/email-test.component';
import { HeaderComponent } from '../components/header/header.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';

const COMPONENTS = [
  HomeComponent,
  AuthComponent,
  EmailTestComponent,
  HeaderComponent,
  LoadingSpinnerComponent
];

const MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [...MODULES, ...COMPONENTS],
  exports: [...MODULES, ...COMPONENTS]
})
export class SharedModule { } 