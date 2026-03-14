import 'dayjs/locale/es';

import { CanalNotificacion, TipoNotificacion } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

dayjs.locale('es');

@Injectable()
export class NotificacionesService {

  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  private interpolar(plantilla: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce(
      (text, [key, val]) => text.replaceAll(`[${key}]`, val),
      plantilla
    );
  }

  private async enviarWhatsApp(telefono: string, mensaje: string): Promise<boolean> {
    try {
      this.logger.log(`📱 WhatsApp → +34${telefono}:\n${mensaje}`);
      return true;
    } catch (error) {
      this.logger.error(`Error enviando WhatsApp a ${telefono}:`, error);
      return false;
    }
  }

  async enviarConfirmacionCita(cita: any): Promise<void> {
    const config = await this.prisma.configuracionNotificaciones.findUnique({
      where: { id: 1 },
    });
    if (!config?.confirmacionCita) return;

    const mensaje = this.interpolar(config.plantillaConfirmacion, {
      NOMBRE:    cita.cliente.nombre.split(' ')[0],
      FECHA:     dayjs(cita.fecha).format('dddd D [de] MMMM'),
      HORA:      dayjs(cita.fecha).format('HH:mm'),
      SERVICIO:  cita.servicio.nombre,
      MATRICULA: cita.vehiculo.matricula,
    });

    const enviado = await this.enviarWhatsApp(cita.cliente.telefono, mensaje);

    await this.prisma.notificacionEnviada.create({
      data: {
        tipo:      TipoNotificacion.CONFIRMACION_CITA,
        canal:     CanalNotificacion.WHATSAPP,
        clienteId: cita.clienteId,
        citaId:    cita.id,
        enviado,
        enviadoAt: enviado ? new Date() : null,
      },
    });
  }

  async notificarNuevaCitaAdmin(cita: any): Promise<void> {
    const [config, taller] = await Promise.all([
      this.prisma.configuracionNotificaciones.findUnique({ where: { id: 1 } }),
      this.prisma.configuracionTaller.findUnique({ where: { id: 1 } }),
    ]);

    if (!config?.nuevaCitaAdmin || !taller?.whatsappAdmin) return;

    const mensaje =
      `🔔 *Nueva cita recibida*\n\n` +
      `👤 ${cita.cliente.nombre}\n` +
      `📞 ${cita.cliente.telefono}\n` +
      `📅 ${dayjs(cita.fecha).format('dddd D [de] MMMM [a las] HH:mm')}\n` +
      `🔧 ${cita.servicio.nombre}\n` +
      `🚗 ${cita.vehiculo.marca} ${cita.vehiculo.modelo ?? ''} · ${cita.vehiculo.matricula}`;

    await this.enviarWhatsApp(taller.whatsappAdmin, mensaje);
  }

  async enviarCancelacionCita(cita: any): Promise<void> {
    const config = await this.prisma.configuracionNotificaciones.findUnique({
      where: { id: 1 },
    });
    if (!config?.cancelacionCita) return;

    const mensaje = this.interpolar(config.plantillaCancelacion, {
      NOMBRE: cita.cliente.nombre.split(' ')[0],
      FECHA:  dayjs(cita.fecha).format('dddd D [de] MMMM'),
      HORA:   dayjs(cita.fecha).format('HH:mm'),
    });

    const enviado = await this.enviarWhatsApp(cita.cliente.telefono, mensaje);

    await this.prisma.notificacionEnviada.create({
      data: {
        tipo:      TipoNotificacion.CANCELACION_CITA,
        canal:     CanalNotificacion.WHATSAPP,
        clienteId: cita.clienteId,
        citaId:    cita.id,
        enviado,
        enviadoAt: enviado ? new Date() : null,
      },
    });
  }
}