import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector:    'app-admin-layout',
  standalone:  true,
  imports:     [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl:    './admin-layout.scss',
})
export class AdminLayout {

  menuAbierto = signal<boolean>(false);

  navItems = [
    { ruta: '/admin/dashboard',      icono: '📊', label: 'Dashboard',      badge: null },
    { ruta: '/admin/citas',          icono: '✅', label: 'Citas',           badge: 3    },
    { ruta: '/admin/calendario',     icono: '📅', label: 'Calendario',      badge: null },
    { ruta: '/admin/clientes',       icono: '👥', label: 'Clientes',        badge: null },
    { ruta: '/admin/servicios',      icono: '🔧', label: 'Servicios',       badge: null },
    { ruta: '/admin/notificaciones', icono: '🔔', label: 'Notificaciones',  badge: null },
    { ruta: '/admin/configuracion',  icono: '⚙️', label: 'Configuracion',   badge: null },
  ];

  constructor(public auth: AuthService) {}

  async logout() {
    await this.auth.logout();
  }

  toggleMenu() {
    this.menuAbierto.set(!this.menuAbierto());
  }
}
