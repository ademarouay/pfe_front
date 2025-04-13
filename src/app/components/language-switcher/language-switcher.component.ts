import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class LanguageSwitcherComponent implements OnInit {
  currentLang: Language = 'fr';
  languages: {code: Language, name: string}[] = [
    { code: 'fr', name: 'FR' },
    { code: 'ar', name: 'عربي' }
  ];

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  changeLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
}