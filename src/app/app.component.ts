import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule, TranslateModule]
})
export class AppComponent implements OnInit {
  title = 'front-end-labess';
  showHeader = true; // Par défaut, l'en-tête est affiché
  constructor(private translate: TranslateService,private router: Router) {}
  ngOnInit() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showHeader = !this.router.url.includes('/login'); // Ne pas afficher si l'URL contient '/login'
        this.translate.setDefaultLang('fr');
      });

}}
