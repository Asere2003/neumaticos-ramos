import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector:    'app-citas',
  standalone:  true,
  imports:     [CommonModule, RouterLink, FormsModule],
  templateUrl: './citas.html',
  styleUrl:    './citas.scss',
})
export class Citas implements OnInit {

  citas        = signal<Cita[]>([]);
  cargando     = signal<boolean>(true);
  error        = signal<string | null>(null);
  filtroEstado = signal<string>('');
  filtroBusqueda = signal<string>('');

  estados: { valor: string; label: string }[] = [
    { valor: '',           label: 'Todos'       },
    { valor: 'PENDIENTE',  label: 'Pendientes'  },
    { valor: 'CONFIRMADA', label: 'Confirmadas' },
    { valor: 'COMPLETADA', label: 'Completadas' },
    { valor: 'CANCELADA',  label: 'Canceladas'  },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.cargando.set(true);
    let url = `${environment.apiUrl}/citas`;
    const params: string[] = [];
    if (this.filtroEstado())    params.push(`estado=${this.filtroEstado()}`);
    if (this.filtroBusqueda())  params.push(`busqueda=${this.filtroBusqueda()}`);
    if (params.length) url += '?' + params.join('&');

    this.http.get<Cita[]>(url).subscribe({
      next:  c => { this.citas.set(c); this.cargando.set(false); },
      error: err => { this.error.set(err.message); this.cargando.set(false); },
    });
  }

  cambiarEstado(id: number, estado: EstadoCita) {
    this.http.patch(`${environment.apiUrl}/citas/${id}/estado`, { estado })
      .subscribe(() => this.cargarCitas());
  }

  confirmar(id: number) {
    this.cambiarEstado(id, 'CONFIRMADA');
  }

  completar(id: number) {
    this.cambiarEstado(id, 'COMPLETADA');
  }

  cancelar(id: number) {
    if (!confirm('Seguro que quieres cancelar esta cita?')) return;
    this.cambiarEstado(id, 'CANCELADA');
  }

  onFiltroChange() {
    this.cargarCitas();
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

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'short',
      day:     'numeric',
      month:   'short',
    });
  }

  formatHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour:   '2-digit',
      minute: '2-digit',
    });
  }
}
