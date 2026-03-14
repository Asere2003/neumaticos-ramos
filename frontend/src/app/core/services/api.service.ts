import {
  Cita,
  Cliente,
  ConfiguracionTaller,
  Servicio,
  SlotDisponible,
  TipoServicio,
  Vehiculo,
} from '../models/cita.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private api: string;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.api = isPlatformBrowser(this.platformId)
      ? environment.apiUrl
      : environment.apiUrlServer;
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.api}/servicios`);
  }

  getSlots(fecha: string, tipoServicio: TipoServicio): Observable<SlotDisponible> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('tipoServicio', tipoServicio);
    return this.http.get<SlotDisponible>(`${this.api}/citas/slots`, { params });
  }

  crearCliente(dto: {
    nombre:           string;
    telefono:         string;
    email?:           string;
    aceptaTerminos:   boolean;
    aceptaMarketing?: boolean;
  }): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.api}/clientes`, dto);
  }

  crearVehiculo(dto: {
    marca:                     string;
    modelo?:                   string;
    matricula:                 string;
    anio?:                     number;
    medidaNeumaticoDelantero?: string;
    clienteId:                 number;
  }): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${this.api}/vehiculos`, dto);
  }

  crearCita(dto: {
    fecha:         string;
    tipoServicio:  TipoServicio;
    clienteId:     number;
    vehiculoId:    number;
    notasCliente?: string;
  }): Observable<Cita> {
    return this.http.post<Cita>(`${this.api}/citas`, dto);
  }

  getCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.api}/citas/${id}`);
  }

  getConfiguracion(): Observable<ConfiguracionTaller> {
    return this.http.get<ConfiguracionTaller>(`${this.api}/configuracion`);
  }

  getDisponibilidadMes(anio: number, mes: number): Observable<any> {
    const params = new HttpParams()
      .set('anio', anio)
      .set('mes', mes);
    return this.http.get(`${this.api}/calendario/disponibilidad`, { params });
  }
}
