import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private supabase: SupabaseClient;
  session  = signal<Session | null>(null);
  loading  = signal<boolean>(true);
  error    = signal<string | null>(null);

  get isAuthenticated() {
    return !!this.session();
  }

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );

    if (isPlatformBrowser(this.platformId)) {
      this.inicializar();
    }
  }

  private async inicializar() {
    const { data } = await this.supabase.auth.getSession();
    this.session.set(data.session);
    this.loading.set(false);

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
    });
  }

  async login(email: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    const { data, error } = await this.supabase.auth
      .signInWithPassword({ email, password });

    if (error) {
      this.error.set(this.traducirError(error.message));
      this.loading.set(false);
      throw error;
    }

    this.session.set(data.session);
    this.loading.set(false);
    this.router.navigate(['/admin/dashboard']);
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.session.set(null);
    this.router.navigate(['/admin/login']);
  }

  async resetPassword(email: string): Promise<void> {
    await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
  }

  async getToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  private traducirError(message: string): string {
    const errores: Record<string, string> = {
      'Invalid login credentials': 'Email o contraseña incorrectos',
      'Email not confirmed':       'Debes confirmar tu email primero',
      'Too many requests':         'Demasiados intentos. Espera unos minutos.',
    };
    return errores[message] ?? 'Error al iniciar sesión. Inténtalo de nuevo.';
  }
}
