import 'dayjs/locale/es';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificacionesService {
    private readonly prisma;
    private readonly config;
    private readonly email;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, email: EmailService);
    private interpolar;
    private enviarWhatsApp;
    enviarConfirmacionCita(cita: any): Promise<void>;
    notificarNuevaCitaAdmin(cita: any): Promise<void>;
    enviarCancelacionCita(cita: any): Promise<void>;
}
