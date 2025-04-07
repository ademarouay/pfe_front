import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'fr' | 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<Language>('fr');
  public currentLang$: Observable<Language> = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Initialize with browser language or default to French
    const savedLang = localStorage.getItem('language') as Language;
    const defaultLang = savedLang || this.getBrowserLang() || 'fr';
    
    this.setLanguage(defaultLang);
  }

  private getBrowserLang(): Language | null {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'fr' || browserLang === 'en' || browserLang === 'ar') 
      ? browserLang as Language 
      : null;
  }

  public setLanguage(lang: Language): void {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    localStorage.setItem('language', lang);
    
    // Set direction for RTL support (Arabic)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  public getCurrentLang(): Language {
    return this.currentLangSubject.value;
  }
}