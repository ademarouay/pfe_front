// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // <-- HttpClientModule est essentiel
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- FormsModule est essentiel pour [(ngModel)]

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module'; // Assurez-vous que ce fichier existe et est correct
import { AppComponent } from './app.component';

// Import des composants (basé sur les fichiers fournis)
import { LoginComponent } from './components/login/login.component';
import { PreinscriptionComponent } from './components/preinscription/preinscription.component';
import { OtpVerificationComponent } from './components/otp-verification/otp-verification.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { EmailTestComponent } from './components/email-test/email-test.component';
import { ClaimFormComponent } from './components/claim-form/claim-form.component';
import { RemboursementCnamComponent } from './remboursement-cnam/remboursement-cnam.component';
import { PriorAuthorizationRequestComponent } from './components/prior-authorization-request/prior-authorization-request.component';
// Importez d'autres composants si nécessaire (AppointmentListComponent, PatientListComponent, etc.)
// Si vous avez des dashboards spécifiques (Medecin, Pharmacien, etc.) utilisés comme composants, importez-les aussi.

// Import des services (basé sur les fichiers fournis)
import { AuthService } from './services/auth.service';
import { OtpService } from './services/otp.service';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';
// Importez d'autres services si nécessaire (UtilisateurService, AppointmentService, etc.)

// Import des modules UI partagés (basé sur les fichiers fournis)
import { PrimeNGModule } from './primeng.module'; // Module pour les composants PrimeNG
import { SharedModule } from './shared/shared.module'; // Module partagé si vous en avez un

// Fonction pour le chargement des traductions ngx-translate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'fr'
    }),
    // Standalone components
    AppComponent,
    LoginComponent,
    PreinscriptionComponent,
    OtpVerificationComponent,
    HomeComponent,
    HeaderComponent,
    ProfileComponent,
    LanguageSwitcherComponent,
    LoadingSpinnerComponent,
    EmailTestComponent,
    ClaimFormComponent,
    RemboursementCnamComponent,
    PriorAuthorizationRequestComponent
  ],
  providers: []
})
export class AppModule { }