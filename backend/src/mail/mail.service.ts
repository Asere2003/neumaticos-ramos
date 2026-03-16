import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(
    private readonly config:  ConfigService,
    private readonly prisma:  PrismaService,
  ) {
    this.resend = new Resend(this.config.get('RESEND_API_KEY'));
  }

  private async getConfigTaller() {
    return this.prisma.configuracionTaller.findUnique({ where: { id: 1 } });
  }

  async enviarConfirmacionCita(params: {
    nombre:   string;
    email:    string;
    fecha:    string;
    hora:     string;
    servicio: string;
    matricula:string;
  }): Promise<boolean> {
    try {
      const taller = await this.getConfigTaller();

      const { error } = await this.resend.emails.send({
        from:    `${taller?.nombre ?? 'Neumaticos Ramos'} <noreply@neumaticosramos.es>`,
        to:      params.email,
        replyTo: taller?.email ?? 'info@neumaticosramos.es',
        subject: `Cita confirmada - ${taller?.nombre ?? 'Neumaticos Ramos'}`,
        html: `
          <h2>Hola ${params.nombre}!</h2>
          <p>Tu cita en <strong>${taller?.nombre}</strong> esta confirmada:</p>
          <ul>
            <li>Fecha: ${params.fecha}</li>
            <li>Hora: ${params.hora}</li>
            <li>Servicio: ${params.servicio}</li>
            <li>Matricula: ${params.matricula}</li>
          </ul>
          <p>${taller?.direccion}, ${taller?.ciudad}</p>
          <p>${taller?.telefono}</p>
          <p>${taller?.web}</p>
        `,
      });

      if (error) {
        this.logger.error('Resend rechazo el email:', error);
        return false;
      }
      return true;

    } catch (error) {
      this.logger.error('Error enviando email de confirmacion', {
        email: params.email,
        error: error?.message,
      });
      return false;
    }
  }

  async enviarRecepcionCita(params: {
  nombre:   string;
  email:    string;
  fecha:    string;
  hora:     string;
  servicio: string;
  matricula:string;
}): Promise<boolean> {
  try {
    const taller = await this.getConfigTaller();

    const { error } = await this.resend.emails.send({
      from:     `${taller?.nombre ?? 'Neumaticos Ramos'} <noreply@neumaticosramos.es>`,
      to:       params.email,
      replyTo: taller?.email ?? 'info@neumaticosramos.es',
      subject:  `Solicitud recibida - ${taller?.nombre ?? 'Neumaticos Ramos'}`,
      html: `
        <h2>Hola ${params.nombre}!</h2>
        <p>Hemos recibido tu solicitud de cita en <strong>${taller?.nombre}</strong>.</p>
        <p>En breve te confirmaremos la disponibilidad.</p>
        <ul>
          <li>📅 <strong>Fecha:</strong> ${params.fecha}</li>
          <li>🕐 <strong>Hora:</strong> ${params.hora}</li>
          <li>🔧 <strong>Servicio:</strong> ${params.servicio}</li>
          <li>🚗 <strong>Matricula:</strong> ${params.matricula}</li>
        </ul>
        <p>📍 ${taller?.direccion}, ${taller?.ciudad}</p>
        <p>📞 ${taller?.telefono}</p>
        <p>Si tienes alguna duda puedes responder a este email.</p>
        <p>Gracias por confiar en nosotros.</p>
      `,
    });

    if (error) {
      this.logger.error('Resend rechazo el email de recepcion:', error);
      return false;
    }
    return true;

  } catch (error) {
    this.logger.error('Error enviando email de recepcion', {
      email: params.email,
      error: error?.message,
    });
    return false;
  }
}
}