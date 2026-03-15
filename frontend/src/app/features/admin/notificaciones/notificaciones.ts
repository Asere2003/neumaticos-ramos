import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ConfigNotif {
  confirmacionCita:    boolean;
  recordatorio24h:     boolean;
  recordatorio2h:      boolean;
  cancelacionCita:     boolean;
  nuevaCitaAdmin:      boolean;
  resumenDiarioAdmin:  boolean;
  cancelacionAdmin:    boolean;
  plantillaConfirmacion: string;
  plantillaRecordatorio: string;
  plantillaCancelacion:  string;
}

@Component({
  selector:    'app-notificaciones',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './notificaciones.html',
  styleUrl:    './notificaciones.scss',
})
export class Notificaciones implements OnInit {

  config    = signal<ConfigNotif | null>(null);
  cargando  = signal<boolean>(true);
  guardando = signal<boolean>(false);
  error     = signal<string | null>(null);
  exito     = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarConfig();
  }

  cargarConfig() {
    this.cargando.set(true);
    this.http.get<any>(`${environment.apiUrl}/configuracion/admin`)
      .subscribe({
        next: data => {
          this.config.set(data.notificaciones);
          this.cargando.set(false);
        },
        error: err => {
          this.error.set(err.message);
          this.cargando.set(false);
        },
      });
  }

  guardar() {
    if (!this.config()) return;
    this.guardando.set(true);
    this.error.set(null);

    this.http.patch(
      `${environment.apiUrl}/configuracion/notificaciones`,
      this.config()
    ).subscribe({
      next: () => {
        this.exito.set('Configuracion guardada correctamente');
        this.guardando.set(false);
        setTimeout(() => this.exito.set(null), 3000);
      },
      error: err => {
        this.error.set(err.message);
        this.guardando.set(false);
      },
    });
  }
}
