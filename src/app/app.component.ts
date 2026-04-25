import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'justplaybo-website-new';
  isSmallScreen = false;
  theme: Theme = 'light';

  private readonly storageKey = 'jp-theme';

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 599px)']).subscribe(() => {
      this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 599px)');
    });
    this.initTheme();
  }

  toggleTheme() {
    this.applyTheme(this.theme === 'light' ? 'dark' : 'light', true);
  }

  private initTheme() {
    const stored = this.readStoredTheme();
    if (stored) {
      this.applyTheme(stored, false);
      return;
    }
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark ? 'dark' : 'light', false);
  }

  private applyTheme(theme: Theme, persist: boolean) {
    this.theme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      this.syncThemeColorMeta(theme);
    }
    if (persist) {
      try { localStorage.setItem(this.storageKey, theme); } catch { /* private mode */ }
    }
  }

  private readStoredTheme(): Theme | null {
    try {
      const v = localStorage.getItem(this.storageKey);
      return v === 'light' || v === 'dark' ? v : null;
    } catch { return null; }
  }

  // Drop the media-conditional theme-color meta tags once the user picks a side
  // and replace them with a single absolute meta so iOS/Android chrome reflects
  // the chosen theme even if it disagrees with the OS preference.
  private syncThemeColorMeta(theme: Theme) {
    const head = document.head;
    if (!head) return;

    head.querySelector('#jp-theme-color-light')?.remove();
    head.querySelector('#jp-theme-color-dark')?.remove();

    let active = head.querySelector<HTMLMetaElement>('#jp-theme-color-active');
    if (!active) {
      active = document.createElement('meta');
      active.name = 'theme-color';
      active.id = 'jp-theme-color-active';
      head.appendChild(active);
    }
    active.content = theme === 'dark' ? '#241917' : '#f6efea';
  }
}
