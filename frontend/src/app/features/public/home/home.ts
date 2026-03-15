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
    this.title.setTitle('Neumaticos Ramos — Taller de Neumaticos en Armilla, Granada');
    this.meta.updateTag({ name: 'description', content: 'Taller de neumaticos en Armilla, Granada. Cambio de neumaticos, alineacion, equilibrado y llantas. Reserva cita online.' });
    this.meta.updateTag({ property: 'og:title', content: 'Neumaticos Ramos — Armilla, Granada' });
    this.meta.updateTag({ property: 'og:description', content: 'Taller profesional en Armilla. Neumaticos Michelin, Kleber, BFGoodrich. Reserva tu cita online.' });
    this.meta.updateTag({ name: 'keywords', content: 'neumaticos Armilla, taller neumaticos Granada, cambio neumaticos, alineacion direccion' });

    this.api.getServicios().subscribe(s => this.servicios.set(s));
    this.api.getConfiguracion().subscribe(c => this.configuracion.set(c));
  }

  get estaAbierto(): boolean {
    const hora  = this.ahora.getHours();
    const dia   = this.ahora.getDay();
    if (dia === 0) return false; // Domingo cerrado
    if (dia === 6) return hora >= 9 && hora < 13; // Sábado
    return (hora >= 9 && hora < 14) || (hora >= 16 && hora < 20);
  }

  get horarioHoy(): string {
    const dia = this.ahora.getDay();
    if (dia === 0) return 'Hoy cerrado';
    if (dia === 6) return 'Hoy: 9:00 – 13:00';
    return 'Hoy: 9:00 – 14:00 · 16:00 – 20:30';
  }
}
