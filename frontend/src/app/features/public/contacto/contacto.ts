import { Component, OnInit, signal } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { ConfiguracionTaller } from '../../../core/models/cita.model';
import { RouterLink } from '@angular/router';

@Component({
  selector:    'app-contacto',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './contacto.html',
  styleUrl:    './contacto.scss',
})
export class Contacto implements OnInit {

  config         = signal<ConfiguracionTaller | null>(null);
  ahora          = new Date();
  mapaAceptado   = signal<boolean>(false);

  private readonly COOKIE_KEY = 'nr_maps_consent';

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.getConfiguracion().subscribe(c => this.config.set(c));

    // Recuperar consentimiento previo
    try {
      const stored = localStorage.getItem(this.COOKIE_KEY);
      if (stored === 'true') this.mapaAceptado.set(true);
    } catch {
      // SSR: localStorage no disponible en servidor
    }
  }

  get estadoAbierto(): boolean {
    const hora = this.ahora.getHours();
    const dia  = this.ahora.getDay();
    if (dia === 0) return false;
    if (dia === 6) return hora >= 9 && hora < 13;
    return (hora >= 9 && hora < 14) || (hora >= 16 && hora < 20);
  }

  aceptarMapa() {
    this.mapaAceptado.set(true);
    try {
      localStorage.setItem(this.COOKIE_KEY, 'true');
    } catch {
      // SSR safe
    }
  }

  copiarDireccion() {
    const dir = this.config()?.direccion + ', ' + this.config()?.ciudad;
    navigator.clipboard.writeText(dir);
  }
}
