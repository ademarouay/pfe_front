import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-remboursement-cnam',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './remboursement-cnam.component.html',
  styleUrls: ['./remboursement-cnam.component.css']
})
export class RemboursementCnamComponent {
  remboursements = [
    { type: 'Consultations et examens complémentaires', taux: '80%' },
    { type: 'Hospitalisations et rééducation fonctionnelle', taux: '90%' },
    { type: 'Évacuations sanitaires à l\'étranger et hémodialyse', taux: '100%' },
    { type: 'Médicaments', taux: '67%' },
    { type: 'Actes de médecine dentaire', taux: '60%' },
    { type: 'Actes paramédicaux, consultations médicales et prestations enfants (4-18 ans)', taux: '70%' },
    { type: 'Actes de radiologie et analyses biologiques', taux: '75%' }
  ];
currentYear: any;
}