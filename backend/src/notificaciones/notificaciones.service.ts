import 'dayjs/locale/es';

import { CanalNotificacion, TipoNotificacion } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EmailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

dayjs.locale('es');

@Injectable()
export class NotificacionesService {

  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly email: EmailService,
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

    const nombre   = cita.cliente.nombre.split(' ')[0];
    const fecha    = dayjs(cita.fecha).format('dddd D [de] MMMM');
    const hora     = dayjs(cita.fecha).format('HH:mm');
    const servicio = cita.servicio.nombre;
    const matricula = cita.vehiculo.matricula;

    // WhatsApp
    const mensajeWA = this.interpolar(config.plantillaConfirmacion, {
      NOMBRE: nombre, FECHA: fecha, HORA: hora,
      SERVICIO: servicio, MATRICULA: matricula,
    });
    const enviadoWA = await this.enviarWhatsApp(cita.cliente.telefono, mensajeWA);

    // Email
    if (cita.cliente.email) {
      await this.email.enviarConfirmacionCita({
        nombre, email: cita.cliente.email,
        fecha, hora, servicio, matricula,
      });
    }

    await this.prisma.notificacionEnviada.create({
      data: {
        tipo:      TipoNotificacion.CONFIRMACION_CITA,
        canal:     CanalNotificacion.WHATSAPP,
        clienteId: cita.clienteId,
        citaId:    cita.id,
        enviado:   enviadoWA,
        enviadoAt: enviadoWA ? new Date() : null,
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

    const nombre = cita.cliente.nombre.split(' ')[0];
    const fecha  = dayjs(cita.fecha).format('dddd D [de] MMMM');
    const hora   = dayjs(cita.fecha).format('HH:mm');

    const mensajeWA = this.interpolar(config.plantillaCancelacion, {
      NOMBRE: nombre, FECHA: fecha, HORA: hora,
    });
    const enviado = await this.enviarWhatsApp(cita.cliente.telefono, mensajeWA);

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