"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed de Neumáticos Ramos...');
    const servicios = await Promise.all([
        prisma.servicio.upsert({
            where: { tipo: client_1.TipoServicio.NEUMATICOS },
            update: {},
            create: {
                tipo: client_1.TipoServicio.NEUMATICOS,
                nombre: 'Neumáticos',
                descripcion: 'Venta y montaje de neumáticos de todas las medidas y temporadas. Disponemos de Michelin, Kleber, BFGoodrich y Kormoran.',
                precioDesde: 60,
                duracionMin: 45,
                activo: true,
            }
        }),
        prisma.servicio.upsert({
            where: { tipo: client_1.TipoServicio.ALINEACION },
            update: {},
            create: {
                tipo: client_1.TipoServicio.ALINEACION,
                nombre: 'Alineación de Dirección',
                descripcion: 'Corrección de la geometría de las ruedas con tecnología láser 3D. Evita el desgaste irregular y mejora la estabilidad.',
                precioDesde: 45,
                duracionMin: 30,
                activo: true,
            }
        }),
        prisma.servicio.upsert({
            where: { tipo: client_1.TipoServicio.EQUILIBRADO },
            update: {},
            create: {
                tipo: client_1.TipoServicio.EQUILIBRADO,
                nombre: 'Equilibrado',
                descripcion: 'Eliminamos las vibraciones del volante con pesos de precisión para una conducción más suave y segura.',
                precioDesde: 35,
                duracionMin: 20,
                activo: true,
            }
        }),
        prisma.servicio.upsert({
            where: { tipo: client_1.TipoServicio.LLANTAS },
            update: {},
            create: {
                tipo: client_1.TipoServicio.LLANTAS,
                nombre: 'Llantas',
                descripcion: 'Catálogo completo de llantas de acero y aleación. Montaje y asesoramiento personalizado incluido.',
                precioDesde: 80,
                duracionMin: 60,
                activo: true,
            }
        }),
    ]);
    console.log(`✅ ${servicios.length} servicios creados`);
    await prisma.configuracionTaller.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            nombre: 'Neumáticos Ramos',
            telefono: '91 234 56 78',
            email: 'info@neumaticosramos.com',
            direccion: 'Avenida de Poniente, 39',
            ciudad: 'Granada',
            codigoPostal: '18100',
            web: 'www.neumaticosramos.com',
            horarioSemanal: {
                lunes: { manana: ['09:00', '14:00'], tarde: ['16:00', '20:30'] },
                martes: { manana: ['09:00', '14:00'], tarde: ['16:00', '20:30'] },
                miercoles: { manana: ['09:00', '14:00'], tarde: ['16:00', '20:30'] },
                jueves: { manana: ['09:00', '14:00'], tarde: ['16:00', '20:30'] },
                viernes: { manana: ['09:00', '14:00'], tarde: ['16:00', '20:30'] },
                sabado: { manana: ['09:00', '13:00'], tarde: null },
                domingo: null,
            },
            intervaloMinutos: 30,
            maxCitasPorSlot: 1,
            whatsappActivo: true,
            emailActivo: false,
            whatsappTaller: '+34912345678',
            whatsappAdmin: '+34612345678',
        }
    });
    console.log('✅ Configuración del taller creada');
    await prisma.configuracionNotificaciones.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            confirmacionCita: true,
            recordatorio24h: true,
            recordatorio2h: false,
            cancelacionCita: true,
            nuevaCitaAdmin: true,
            resumenDiarioAdmin: true,
            cancelacionAdmin: true,
            plantillaConfirmacion: `Hola [NOMBRE] 👋\n\nTu cita en *Neumáticos Ramos* está confirmada:\n📅 *[FECHA]* a las *[HORA]*\n🔧 *[SERVICIO]*\n🚗 Matrícula: *[MATRICULA]*\n📍 Avenida de Poniente, 39, Granada\n\n¿Necesitas cancelar? Llámanos: *91 234 56 78*`,
            plantillaRecordatorio: `Hola [NOMBRE] ⏰\n\nTe recordamos tu cita de mañana en *Neumáticos Ramos*:\n📅 *[FECHA]* a las *[HORA]*\n🔧 *[SERVICIO]*\n\n¡Te esperamos! 🚗`,
            plantillaCancelacion: `Hola [NOMBRE],\n\nTu cita del *[FECHA]* a las *[HORA]* en Neumáticos Ramos ha sido cancelada.\n\nPara volver a reservar: www.neumaticosramos.com\n📞 91 234 56 78`,
        }
    });
    console.log('✅ Configuración de notificaciones creada');
    const festivos2025 = [
        { fecha: '2025-01-01', motivo: 'Año Nuevo', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-01-06', motivo: 'Reyes Magos', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-04-18', motivo: 'Viernes Santo', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-05-01', motivo: 'Día del Trabajador', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-05-02', motivo: 'Día de la Comunidad de Madrid', tipo: client_1.TipoBloqueo.FESTIVO_LOCAL },
        { fecha: '2025-08-15', motivo: 'Asunción de la Virgen', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-10-12', motivo: 'Fiesta Nacional de España', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-11-01', motivo: 'Todos los Santos', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-11-10', motivo: 'Almudena — Festivo Madrid', tipo: client_1.TipoBloqueo.FESTIVO_LOCAL },
        { fecha: '2025-12-06', motivo: 'Día de la Constitución', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-12-08', motivo: 'Inmaculada Concepción', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
        { fecha: '2025-12-25', motivo: 'Navidad', tipo: client_1.TipoBloqueo.FESTIVO_NACIONAL },
    ];
    for (const festivo of festivos2025) {
        const inicio = new Date(`${festivo.fecha}T00:00:00`);
        const fin = new Date(`${festivo.fecha}T23:59:59`);
        await prisma.bloqueoCalendario.create({
            data: {
                fechaInicio: inicio,
                fechaFin: fin,
                todoDia: true,
                tipo: festivo.tipo,
                motivo: festivo.motivo,
                activo: true,
            }
        });
    }
    console.log(`✅ ${festivos2025.length} festivos 2025 creados`);
    console.log('🎉 Seed completado con éxito');
}
main()
    .catch(e => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map