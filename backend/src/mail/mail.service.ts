import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get('RESEND_API_KEY'));
  }

  async enviarConfirmacionCita(params: {
    nombre: string;
    email: string;
    fecha: string;
    hora: string;
    servicio: string;
    matricula: string;
  }): Promise<boolean> {
    try {
      await this.resend.emails.send({
        from: 'Neumáticos Ramos <noreply@send.neumaticosramos.es>',
        to: params.email,
        subject: '✅ Cita confirmada - Neumáticos Ramos',
        html: `
          <h2>¡Hola ${params.nombre}!</h2>
          <p>Tu cita en <strong>Neumáticos Ramos</strong> está confirmada:</p>
          <ul>
            <li>📅 <strong>Fecha:</strong> ${params.fecha}</li>
            <li>🕐 <strong>Hora:</strong> ${params.hora}</li>
            <li>🔧 <strong>Servicio:</strong> ${params.servicio}</li>
            <li>🚗 <strong>Matrícula:</strong> ${params.matricula}</li>
          </ul>
          <p>📍 Avenida de Poniente, 39, Granada</p>
          <p>📞 91 234 56 78</p>
        `,
      });
      return true;
    } catch (error) {
      this.logger.error('Error enviando email:', error);
      return false;
    }
  }
}