import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacidad.html',
  styleUrl: './privacidad.scss'
})
export class PrivacidadComponent {
  readonly year = new Date().getFullYear();
}
