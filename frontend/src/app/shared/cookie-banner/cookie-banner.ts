import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss'
})
export class CookieBannerComponent implements OnInit {

  visible = signal<boolean>(false);

  private readonly COOKIE_KEY = 'nr_cookie_consent';

  ngOnInit() {
    try {
      const stored = localStorage.getItem(this.COOKIE_KEY);
      if (!stored) this.visible.set(true);
    } catch {
      // SSR safe
    }
  }

  aceptar() {
    try {
      localStorage.setItem(this.COOKIE_KEY, 'accepted');
    } catch {}
    this.visible.set(false);
  }

  rechazar() {
    try {
      localStorage.setItem(this.COOKIE_KEY, 'rejected');
    } catch {}
    this.visible.set(false);
  }
}
