import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/layout/public-layout/public-layout')
        .then(m => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home')
            .then(m => m.Home),
        title: 'Neumáticos Ramos — Taller Profesional en Granada',
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./features/public/servicios/servicios')
            .then(m => m.Servicios),
        title: 'Servicios — Neumáticos Ramos',
      },
      {
        path: 'reservar',
        loadComponent: () =>
          import('./features/public/reserva/reserva')
            .then(m => m.Reserva),
        title: 'Reservar Cita — Neumáticos Ramos',
      },
      {
        path: 'confirmacion/:id',
        loadComponent: () =>
          import('./features/public/confirmacion/confirmacion')
            .then(m => m.Confirmacion),
        title: 'Cita Confirmada — Neumáticos Ramos',
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/public/contacto/contacto')
            .then(m => m.Contacto),
        title: 'Contacto — Neumáticos Ramos',
      },
    ],
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/admin/login/login')
            .then(m => m.Login),
        title: 'Acceso Admin — Neumáticos Ramos',
      },
      {
        path: '',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/layout/admin-layout/admin-layout')
            .then(m => m.AdminLayout),
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/admin/dashboard/dashboard')
                .then(m => m.Dashboard),
            title: 'Dashboard — Admin',
          },
           {
        path: 'citas',
        loadComponent: () =>
          import('./features/admin/citas/citas')
            .then(m => m.Citas),
        title: 'Citas — Admin',
      },
      {
        path: 'calendario',
        loadComponent: () =>
          import('./features/admin/calendario/calendario')
            .then(m => m.Calendario),
        title: 'Calendario — Admin',
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/admin/clientes/clientes')
            .then(m => m.Clientes),
        title: 'Clientes — Admin',
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./features/admin/servicios/servicios')
            .then(m => m.Servicios),
        title: 'Servicios — Admin',
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./features/admin/notificaciones/notificaciones')
            .then(m => m.Notificaciones),
        title: 'Notificaciones — Admin',
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/admin/configuracion/configuracion')
            .then(m => m.Configuracion),
        title: 'Configuracion — Admin',
      }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
