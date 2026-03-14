export type EstadoCita =
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'EN_PROCESO'
  | 'COMPLETADA'
  | 'CANCELADA'
  | 'NO_SHOW';

export type TipoServicio =
  | 'NEUMATICOS'
  | 'ALINEACION'
  | 'EQUILIBRADO'
  | 'LLANTAS';

export interface Servicio {
  id:          number;
  tipo:        TipoServicio;
  nombre:      string;
  descripcion: string;
  precioDesde: number | null;
  duracionMin: number;
  activo:      boolean;
}

export interface Cliente {
  id:                  number;
  nombre:              string;
  telefono:            string;
  email:               string | null;
  aceptaTerminos:      boolean;
  aceptaMarketing:     boolean;
  eliminado:           boolean;
  createdAt:           string;
}

export interface Vehiculo {
  id:                       number;
  marca:                    string;
  modelo:                   string | null;
  matricula:                string;
  anio:                     number | null;
  medidaNeumaticoDelantero: string | null;
  clienteId:                number;
}

export interface Cita {
  id:           number;
  fecha:        string;
  fechaFin:     string | null;
  estado:       EstadoCita;
  notasCliente: string | null;
  notasTaller:  string | null;
  precioFinal:  number | null;
  cliente:      Cliente;
  vehiculo:     Vehiculo;
  servicio:     Servicio;
  createdAt:    string;
}

export interface SlotDisponible {
  disponible: boolean;
  fecha:      string;
  slots:      string[];
  motivo?:    string;
}

export interface ConfiguracionTaller {
  nombre:         string;
  telefono:       string;
  email:          string;
  direccion:      string;
  ciudad:         string;
  codigoPostal:   string;
  web:            string;
  horarioSemanal: any;
}
