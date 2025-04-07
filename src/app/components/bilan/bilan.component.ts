import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bilan',
  imports: [CommonModule],
  templateUrl: './bilan.component.html',
  styleUrls: ['./bilan.component.css']
})
export class BilanComponent {
  bilans = [
    { patient: 'Jean Dupont', date: '2024-03-15', evaluation: 'Amélioration mobilité articulaire' },
    { patient: 'Sophie Martin', date: '2024-03-14', evaluation: 'Réduction douleur lombaire' }
  ];
}