import { Component, OnInit, signal } from '@angular/core';
import { ConfiguracionTaller, Servicio } from '../../../core/models/cita.model';
import { Meta, Title } from '@angular/platform-browser';

import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector:    'app-home',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl:    './home.scss',
})
export class Home implements OnInit {

  servicios     = signal<Servicio[]>([]);
  configuracion = signal<ConfiguracionTaller | null>(null);
  ahora         = new Date();
  seoAbierto    = false;

  iconos: Record<string, string> = {
    NEUMATICOS:  '🔄',
    ALINEACION:  '📐',
    EQUILIBRADO: '⚙️',
    LLANTAS:     '🔩',
  };

  constructor(
      private readonly api: ApiService,
      private readonly title: Title,
      private readonly meta: Meta
  ) {}

  ngOnInit() {
    this.title.setTitle('Neumáticos Ramos — Taller Pirelli Drive en Armilla, Granada');
    this.meta.updateTag({ name: 'description', content: 'Taller de neumáticos en Armilla, Granada. Taller certificado Pirelli Drive. Cambio de neumáticos, alineación, equilibrado y llantas. Más de 20 años de experiencia. Reserva cita online.' });
    this.meta.updateTag({ property: 'og:title', content: 'Neumáticos Ramos — Taller Pirelli Drive en Armilla, Granada' });
    this.meta.updateTag({ property: 'og:description', content: 'Taller certificado Pirelli Drive en Armilla, Granada. Más de 20 años de experiencia en neumáticos, alineación, equilibrado y llantas. Reserva tu cita online.' });
    this.meta.updateTag({ name: 'keywords', content: 'taller neumáticos Granada, neumáticos Armilla, cambio neumáticos Granada, taller Pirelli Granada, equilibrado ruedas Granada, alineación dirección Granada, llantas Granada, cambiar neumáticos coche Granada' });

    this.api.getServicios().subscribe(s => this.servicios.set(s));
    this.api.getConfiguracion().subscribe(c => this.configuracion.set(c));
  }

  get estaAbierto(): boolean {
    const hora  = this.ahora.getHours();
    const dia   = this.ahora.getDay();
    if (dia === 0) return false;
    if (dia === 6) return hora >= 9 && hora < 13;
    return (hora >= 9 && hora < 14) || (hora >= 16 && hora < 20);
  }

  get horarioHoy(): string {
    const dia = this.ahora.getDay();
    if (dia === 0) return 'Hoy cerrado';
    if (dia === 6) return 'Hoy: 9:00 – 13:00';
    return 'Hoy: 9:00 – 14:00 · 16:00 – 20:30';
  }
}
