import 'dayjs/locale/es';

import { Component, Input, OnInit, signal } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { Cita } from '../../../core/models/cita.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';

dayjs.locale('es');

@Component({
  selector:    'app-confirmacion',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './confirmacion.html',
  styleUrl:    './confirmacion.scss',
})
export class Confirmacion implements OnInit {

  @Input() id!: string;

  cita     = signal<Cita | null>(null);
  cargando = signal<boolean>(true);
  error    = signal<string | null>(null);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCita(parseInt(this.id)).subscribe({
      next:  c => { this.cita.set(c); this.cargando.set(false); },
      error: () => {
        this.error.set('No se encontró la cita');
        this.cargando.set(false);
      },
    });
  }

  formatearFecha(fecha: string): string {
    return dayjs(fecha).format('dddd D [de] MMMM [a las] HH:mm');
  }

  anadirCalendario() {
    const cita = this.cita();
    if (!cita) return;

    const inicio = dayjs(cita.fecha).format('YYYYMMDDTHHmmss');
    const fin    = dayjs(cita.fechaFin ?? cita.fecha).format('YYYYMMDDTHHmmss');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cita+Neumáticos+Ramos&dates=${inicio}/${fin}&details=${cita.servicio.nombre}&location=Avenida+de+Poniente,+39,+Granada`;
    window.open(url, '_blank');
  }

  compartirWhatsApp() {
    const cita = this.cita();
    if (!cita) return;
    const msg = `Mi cita en Neumáticos Ramos:%0A📅 ${this.formatearFecha(cita.fecha)}%0A🔧 ${cita.servicio.nombre}%0A🚗 ${cita.vehiculo.matricula}`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
