import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Servicio } from '../../../core/models/cita.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector:    'app-servicios-admin',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './servicios.html',
  styleUrl:    './servicios.scss',
})
export class Servicios implements OnInit {

  servicios = signal<Servicio[]>([]);
  cargando  = signal<boolean>(true);
  guardando = signal<boolean>(false);
  error     = signal<string | null>(null);
  exito     = signal<string | null>(null);

  iconos: Record<string, string> = {
    NEUMATICOS:  '🔄',
    ALINEACION:  '📐',
    EQUILIBRADO: '⚙️',
    LLANTAS:     '🔩',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarServicios();
  }

  cargarServicios() {
    this.cargando.set(true);
    this.http.get<Servicio[]>(`${environment.apiUrl}/servicios`)
      .subscribe({
        next:  s => {
          // Cargamos todos incluyendo inactivos
          this.servicios.set(s);
          this.cargando.set(false);
        },
        error: err => {
          this.error.set(err.message);
          this.cargando.set(false);
        },
      });
  }

  actualizar(servicio: Servicio) {
    this.guardando.set(true);
    this.error.set(null);

    this.http.patch(`${environment.apiUrl}/servicios/${servicio.id}`, {
      nombre:      servicio.nombre,
      descripcion: servicio.descripcion,
      precioDesde: servicio.precioDesde,
      duracionMin: servicio.duracionMin,
      activo:      servicio.activo,
    }).subscribe({
      next: () => {
        this.exito.set('Servicio actualizado correctamente');
        this.guardando.set(false);
        setTimeout(() => this.exito.set(null), 3000);
      },
      error: err => {
        this.error.set(err.message);
        this.guardando.set(false);
      },
    });
  }

  toggleActivo(servicio: Servicio) {
    servicio.activo = !servicio.activo;
    this.actualizar(servicio);
  }
}
