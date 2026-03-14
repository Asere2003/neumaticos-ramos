import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface DashboardData {
  fecha: string;
  stats: {
    citasHoy:      number;
    pendientesHoy: number;
    confirmadas:   number;
    citasSemana:   number;
    clientesMes:   number;
    totalClientes: number;
  };
  citasHoy:         Cita[];
  bloqueosProximos: any[];
}

@Component({
  selector:    'app-dashboard',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl:    './dashboard.scss',
})
export class Dashboard implements OnInit {

  data     = signal<DashboardData | null>(null);
  cargando = signal<boolean>(true);
  error    = signal<string | null>(null);
  hoy      = new Date();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.http.get<DashboardData>(`${environment.apiUrl}/dashboard`)
      .subscribe({
        next:  d => { this.data.set(d); this.cargando.set(false); },
        error: err => {
          this.error.set(err.message);
          this.cargando.set(false);
        },
      });
  }

  confirmarCita(id: number) {
    this.http.patch(`${environment.apiUrl}/citas/${id}/estado`, {
      estado: 'CONFIRMADA'
    }).subscribe(() => this.cargarDatos());
  }

  cancelarCita(id: number) {
    if (!confirm('Seguro que quieres cancelar esta cita?')) return;
    this.http.patch(`${environment.apiUrl}/citas/${id}/estado`, {
      estado: 'CANCELADA'
    }).subscribe(() => this.cargarDatos());
  }

  getClaseEstado(estado: EstadoCita): string {
    const clases: Record<string, string> = {
      PENDIENTE:  'badge-pending',
      CONFIRMADA: 'badge-confirmed',
      EN_PROCESO: 'badge-blue',
      COMPLETADA: 'badge-done',
      CANCELADA:  'badge-cancelled',
      NO_SHOW:    'badge-cancelled',
    };
    return clases[estado] ?? '';
  }

  getEtiquetaEstado(estado: EstadoCita): string {
    const etiquetas: Record<string, string> = {
      PENDIENTE:  'Pendiente',
      CONFIRMADA: 'Confirmada',
      EN_PROCESO: 'En proceso',
      COMPLETADA: 'Completada',
      CANCELADA:  'Cancelada',
      NO_SHOW:    'No se presento',
    };
    return etiquetas[estado] ?? estado;
  }

  formatHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour:   '2-digit',
      minute: '2-digit',
    });
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day:   'numeric',
      month: 'short',
    });
  }
}
