import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ConfigTaller {
  nombre:         string;
  telefono:       string;
  email:          string;
  direccion:      string;
  ciudad:         string;
  codigoPostal:   string;
  web:            string;
  whatsappTaller: string;
  whatsappAdmin:  string;
  intervaloMinutos: number;
  maxCitasPorSlot:  number;
}

@Component({
  selector:    'app-configuracion',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl:    './configuracion.scss',
})
export class Configuracion implements OnInit {

  config    = signal<ConfigTaller | null>(null);
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
          this.config.set(data.taller);
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
      `${environment.apiUrl}/configuracion/taller`,
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
