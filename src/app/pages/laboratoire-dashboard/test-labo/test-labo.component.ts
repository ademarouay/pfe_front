import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-labo',
  templateUrl: './test-labo.component.html',
  styleUrls: ['./test-labo.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TestLaboComponent {
  tests: string[] = ['Blood test', 'Urine test', 'X-ray', 'ECG', 'Glucose test'];
}