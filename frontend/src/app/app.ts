import { Component, signal } from '@angular/core';

import { CookieBannerComponent } from "./shared/cookie-banner/cookie-banner";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('neumaticos-ramos-web');
}
