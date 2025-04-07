// header.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Utilisateur } from '../../models/utilisateur';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent, TranslateModule]
})
export class HeaderComponent {
  currentUser: Utilisateur | null = null;
  isDarkTheme = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}