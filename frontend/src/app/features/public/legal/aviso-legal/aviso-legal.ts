import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aviso-legal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './aviso-legal.html',
  styleUrl: './aviso-legal.scss'
})
export class AvisoLegalComponent {
  readonly year = new Date().getFullYear();
}
