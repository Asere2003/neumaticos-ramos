import 'dayjs/locale/es';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificacionesService {
    private prisma;
    private config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    private interpolar;
    private enviarWhatsApp;
    enviarConfirmacionCita(cita: any): Promise<void>;
    notificarNuevaCitaAdmin(cita: any): Promise<void>;
    enviarCancelacionCita(cita: any): Promise<void>;
}
