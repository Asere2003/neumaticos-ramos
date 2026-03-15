import { Component, OnInit, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Cliente } from '../../../core/models/cita.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

interface ClienteDetalle extends Cliente {
  vehiculos: any[];
  citas:     any[];
  _count:    { citas: number };
}

@Component({
  selector:    'app-clientes',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl:    './clientes.scss',
})
export class Clientes implements OnInit {

  clientes         = signal<ClienteDetalle[]>([]);
  clienteSeleccionado = signal<ClienteDetalle | null>(null);
  cargando         = signal<boolean>(true);
  error            = signal<string | null>(null);
  busqueda         = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando.set(true);
    let params = new HttpParams();
    if (this.busqueda) params = params.set('busqueda', this.busqueda);

    this.http.get<ClienteDetalle[]>(`${environment.apiUrl}/clientes`, { params })
      .subscribe({
        next:  c => { this.clientes.set(c); this.cargando.set(false); },
        error: err => { this.error.set(err.message); this.cargando.set(false); },
      });
  }

  seleccionarCliente(cliente: ClienteDetalle) {
    this.clienteSeleccionado.set(cliente);
  }

  cerrarDetalle() {
    this.clienteSeleccionado.set(null);
  }

  eliminarCliente(id: number) {
    if (!confirm('Seguro? Esto eliminara todos los datos del cliente (RGPD)')) return;
    this.http.delete(`${environment.apiUrl}/clientes/${id}`)
      .subscribe(() => {
        this.cerrarDetalle();
        this.cargarClientes();
      });
  }

  getIniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day:   'numeric',
      month: 'short',
      year:  'numeric',
    });
  }

  formatHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour:   '2-digit',
      minute: '2-digit',
    });
  }

  getTotalGasto(citas: any[]): number {
    return citas.reduce((total, c) => total + (c.precioFinal ?? 0), 0);
  }
}
