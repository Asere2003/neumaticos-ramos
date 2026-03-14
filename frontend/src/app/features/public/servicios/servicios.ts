import { Component, OnInit, signal } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../core/models/cita.model';

@Component({
  selector:    'app-servicios',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './servicios.html',
  styleUrl:    './servicios.scss',
})
export class Servicios implements OnInit {

  servicios = signal<Servicio[]>([]);
  cargando  = signal<boolean>(true);

  iconos: Record<string, string> = {
    NEUMATICOS:  '🔄',
    ALINEACION:  '📐',
    EQUILIBRADO: '⚙️',
    LLANTAS:     '🔩',
  };

  detalles: Record<string, string[]> = {
    NEUMATICOS:  [
      'Todas las medidas y temporadas',
      'Michelin, Kleber, BFGoodrich y Kormoran',
      'Montaje y equilibrado incluido',
      'Revisión de presión y desgaste',
    ],
    ALINEACION:  [
      'Tecnología láser 3D',
      'Corrección de geometría',
      'Informe técnico incluido',
      'Evita el desgaste irregular',
    ],
    EQUILIBRADO: [
      'Pesos de precisión',
      'Elimina vibraciones del volante',
      'Mayor durabilidad del neumático',
      'Conducción más suave y segura',
    ],
    LLANTAS:     [
      'Acero y aleación',
      'Montaje incluido',
      'Asesoramiento personalizado',
      'Reparación y personalización',
    ],
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getServicios().subscribe({
      next:  s => { this.servicios.set(s); this.cargando.set(false); },
      error: () => this.cargando.set(false),
    });
  }
}
