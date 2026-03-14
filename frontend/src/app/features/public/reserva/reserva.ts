import 'dayjs/locale/es';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Servicio, TipoServicio } from '../../../core/models/cita.model';

import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';

dayjs.locale('es');

@Component({
  selector:    'app-reserva',
  standalone:  true,
  imports:     [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './reserva.html',
  styleUrl:    './reserva.scss',
})
export class Reserva implements OnInit {

  pasoActual    = signal<1 | 2 | 3>(1);
  cargando      = signal<boolean>(false);
  error         = signal<string | null>(null);
  servicios     = signal<Servicio[]>([]);
  slotsDelDia   = signal<string[]>([]);
  cargandoSlots = signal<boolean>(false);

  servicioSeleccionado = signal<Servicio | null>(null);
  fechaSeleccionada    = signal<string | null>(null);
  horaSeleccionada     = signal<string | null>(null);

  iconos: Record<string, string> = {
    NEUMATICOS:  '🔄',
    ALINEACION:  '📐',
    EQUILIBRADO: '⚙️',
    LLANTAS:     '🔩',
  };

  diasCalendario = computed(() => {
    const hoy  = dayjs();
    const dias = [];
    for (let i = 0; i < 14; i++) {
      const dia = hoy.add(i, 'day');
      dias.push({
        fecha:     dia.format('YYYY-MM-DD'),
        nombre:    dia.format('ddd').toUpperCase(),
        numero:    dia.format('D'),
        mes:       dia.format('MMM').toUpperCase(),
        esHoy:     i === 0,
        esDomingo: dia.day() === 0,
        esSabado:  dia.day() === 6,
      });
    }
    return dias;
  });

  slotsManana = computed(() =>
    this.slotsDelDia().filter(s => {
      const h = parseInt(s.split(':')[0]);
      return h < 14;
    })
  );

  slotsTarde = computed(() =>
    this.slotsDelDia().filter(s => {
      const h = parseInt(s.split(':')[0]);
      return h >= 16;
    })
  );

  progreso = computed(() => {
    const p: Record<number, number> = { 1: 33, 2: 66, 3: 99 };
    return p[this.pasoActual()];
  });

  form: FormGroup;

  constructor(
    private api:   ApiService,
    private fb:    FormBuilder,
    private router:Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      nombre:          ['', [Validators.required, Validators.minLength(2)]],
      telefono:        ['', [Validators.required, Validators.pattern(/^[6789]\d{8}$/)]],
      email:           ['', [Validators.email]],
      marca:           ['', Validators.required],
      modelo:          [''],
      matricula:       ['', [Validators.required, Validators.pattern(/^\d{4}[A-Z]{3}$|^[A-Z]{1,2}\d{4}[A-Z]{2}$/i)]],
      anio:            [''],
      medida:          [''],
      aceptaTerminos:  [false, Validators.requiredTrue],
      aceptaMarketing: [false],
    });
  }

  ngOnInit() {
    this.api.getServicios().subscribe(s => this.servicios.set(s));

    // Si viene con ?servicio=NEUMATICOS preseleccionamos
    this.route.queryParams.subscribe(params => {
      if (params['servicio']) {
        this.api.getServicios().subscribe(servicios => {
          const s = servicios.find(sv => sv.tipo === params['servicio']);
          if (s) this.servicioSeleccionado.set(s);
        });
      }
    });
  }

  seleccionarServicio(servicio: Servicio) {
    this.servicioSeleccionado.set(servicio);
  }

  irPaso2() {
    if (!this.servicioSeleccionado()) return;
    this.pasoActual.set(2);
  }

  seleccionarFecha(fecha: string) {
    this.fechaSeleccionada.set(fecha);
    this.horaSeleccionada.set(null);
    this.slotsDelDia.set([]);
    this.cargandoSlots.set(true);

    this.api.getSlots(fecha, this.servicioSeleccionado()!.tipo as TipoServicio)
      .subscribe({
        next:  data => {
          this.slotsDelDia.set(data.slots ?? []);
          this.cargandoSlots.set(false);
        },
        error: () => this.cargandoSlots.set(false),
      });
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada.set(hora);
  }

  irPaso3() {
    if (!this.fechaSeleccionada() || !this.horaSeleccionada()) return;
    this.pasoActual.set(3);
  }

  volver() {
    if (this.pasoActual() > 1) {
      this.pasoActual.set((this.pasoActual() - 1) as 1 | 2 | 3);
    }
  }

  async confirmar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    const f = this.form.value;

    try {
      const cliente = await this.api.crearCliente({
        nombre:          f.nombre,
        telefono:        f.telefono.replace(/\s/g, ''),
        email:           f.email || undefined,
        aceptaTerminos:  f.aceptaTerminos,
        aceptaMarketing: f.aceptaMarketing,
      }).toPromise();

      const vehiculo = await this.api.crearVehiculo({
        marca:                    f.marca,
        modelo:                   f.modelo || undefined,
        matricula:                f.matricula.toUpperCase().replace(/\s/g, ''),
        anio:                     f.anio ? parseInt(f.anio) : undefined,
        medidaNeumaticoDelantero: f.medida || undefined,
        clienteId:                cliente!.id,
      }).toPromise();

      const fechaHora = `${this.fechaSeleccionada()}T${this.horaSeleccionada()}:00.000Z`;
      const cita = await this.api.crearCita({
        fecha:       fechaHora,
        tipoServicio:this.servicioSeleccionado()!.tipo as TipoServicio,
        clienteId:   cliente!.id,
        vehiculoId:  vehiculo!.id,
      }).toPromise();

      this.router.navigate(['/confirmacion', cita!.id]);

    } catch (err: any) {
      this.error.set(err.message ?? 'Error al reservar. Inténtalo de nuevo.');
      this.cargando.set(false);
    }
  }

  getError(campo: string): string | null {
    const c = this.form.get(campo);
    if (!c?.invalid || !c.touched) return null;
    if (c.errors?.['required'])     return 'Campo obligatorio';
    if (c.errors?.['requiredTrue']) return 'Debes aceptar los términos';
    if (c.errors?.['minlength'])    return 'Demasiado corto';
    if (c.errors?.['email'])        return 'Email no válido';
    if (c.errors?.['pattern']) {
      if (campo === 'telefono')  return 'Teléfono no válido (ej: 612345678)';
      if (campo === 'matricula') return 'Matrícula no válida (ej: 1234ABC)';
    }
    return null;
  }
}
