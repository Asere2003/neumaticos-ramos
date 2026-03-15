import 'dayjs/locale/es';

import { Component, OnInit, computed, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { environment } from '../../../../environments/environment';

dayjs.locale('es');

interface Bloqueo {
  id:          number;
  fechaInicio: string;
  fechaFin:    string;
  todoDia:     boolean;
  tipo:        string;
  motivo:      string;
  activo:      boolean;
}

@Component({
  selector:    'app-calendario',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './calendario.html',
  styleUrl:    './calendario.scss',
})
export class Calendario implements OnInit {

  bloqueos      = signal<Bloqueo[]>([]);
  cargando      = signal<boolean>(true);
  guardando     = signal<boolean>(false);
  error         = signal<string | null>(null);
  exito         = signal<string | null>(null);

  mesActual     = signal<dayjs.Dayjs>(dayjs().startOf('month'));

  // Form bloqueo
  nuevoBloqueo = {
    fechaInicio: '',
    fechaFin:    '',
    tipo:        'FESTIVO_NACIONAL',
    motivo:      '',
    todoDia:     true,
  };

  tiposBloqueo = [
    { valor: 'VACACIONES',        label: '🏖️ Vacaciones'          },
    { valor: 'FESTIVO_NACIONAL',  label: '🎉 Festivo nacional'    },
    { valor: 'FESTIVO_LOCAL',     label: '📍 Festivo local'       },
    { valor: 'BAJA',              label: '🤒 Baja / Enfermedad'   },
    { valor: 'MANTENIMIENTO',     label: '🔧 Mantenimiento'       },
    { valor: 'OTRO',              label: '📋 Otro motivo'         },
  ];

  diasMes = computed(() => {
    const inicio   = this.mesActual().startOf('month');
    const fin      = this.mesActual().endOf('month');
    const diasSem  = inicio.day() === 0 ? 6 : inicio.day() - 1;
    const dias     = [];

    // Dias vacios al inicio
    for (let i = 0; i < diasSem; i++) {
      dias.push(null);
    }

    let current = inicio;
    while (current.isBefore(fin) || current.isSame(fin, 'day')) {
      const fechaStr = current.format('YYYY-MM-DD');
      const bloqueado = this.bloqueos().some(b => {
        const bInicio = dayjs(b.fechaInicio).format('YYYY-MM-DD');
        const bFin    = dayjs(b.fechaFin).format('YYYY-MM-DD');
        return fechaStr >= bInicio && fechaStr <= bFin;
      });

      dias.push({
        fecha:     fechaStr,
        numero:    current.date(),
        esHoy:     current.isSame(dayjs(), 'day'),
        esDomingo: current.day() === 0,
        bloqueado,
      });
      current = current.add(1, 'day');
    }
    return dias;
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarBloqueos();
  }

  cargarBloqueos() {
    this.cargando.set(true);
    this.http.get<Bloqueo[]>(`${environment.apiUrl}/calendario/bloqueos`)
      .subscribe({
        next:  b => { this.bloqueos.set(b); this.cargando.set(false); },
        error: err => { this.error.set(err.message); this.cargando.set(false); },
      });
  }

  mesAnterior() {
    this.mesActual.set(this.mesActual().subtract(1, 'month'));
  }

  mesSiguiente() {
    this.mesActual.set(this.mesActual().add(1, 'month'));
  }

  crearBloqueo() {
    if (!this.nuevoBloqueo.fechaInicio || !this.nuevoBloqueo.tipo) return;

    this.guardando.set(true);
    this.error.set(null);

    this.http.post(`${environment.apiUrl}/calendario/bloqueos`, this.nuevoBloqueo)
      .subscribe({
        next: () => {
          this.exito.set('Fecha bloqueada correctamente');
          this.guardando.set(false);
          this.nuevoBloqueo = {
            fechaInicio: '',
            fechaFin:    '',
            tipo:        'FESTIVO_NACIONAL',
            motivo:      '',
            todoDia:     true,
          };
          this.cargarBloqueos();
          setTimeout(() => this.exito.set(null), 3000);
        },
        error: err => {
          this.error.set(err.message);
          this.guardando.set(false);
        },
      });
  }

  eliminarBloqueo(id: number) {
    if (!confirm('Seguro que quieres eliminar este bloqueo?')) return;
    this.http.delete(`${environment.apiUrl}/calendario/bloqueos/${id}`)
      .subscribe(() => this.cargarBloqueos());
  }

  formatFecha(fecha: string): string {
    return dayjs(fecha).format('D MMM YYYY');
  }
}
