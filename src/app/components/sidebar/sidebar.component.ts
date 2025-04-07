import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" routerLink="/medecin-dashboard/patients" routerLinkActive="active">Patients</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/medecin-dashboard/appointments" routerLinkActive="active">Rendez-vous</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/medecin-dashboard/prescriptions" routerLinkActive="active">Ordonnances</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/medecin-dashboard/consultation" routerLinkActive="active">Consultation</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/medecin-dashboard/demande-plafond" routerLinkActive="active">Demande Plafond</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent {}