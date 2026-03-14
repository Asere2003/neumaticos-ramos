import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector:    'app-login',
  standalone:  true,
  imports:     [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl:    './login.scss',
})
export class Login {

  form: FormGroup;
  cargando    = signal<boolean>(false);
  error       = signal<string | null>(null);
  mostrarPass = signal<boolean>(false);

  constructor(
    private fb:   FormBuilder,
    private auth: AuthService,
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    try {
      await this.auth.login(
        this.form.value.email,
        this.form.value.password,
      );
    } catch (err: any) {
      this.error.set(err.message ?? 'Error al iniciar sesion');
      this.cargando.set(false);
    }
  }

  togglePass() {
    this.mostrarPass.set(!this.mostrarPass());
  }

  async recuperarPassword() {
    const email = this.form.get('email')?.value;
    if (!email) {
      this.error.set('Introduce tu email primero');
      return;
    }
    try {
      await this.auth.resetPassword(email);
      alert('Te hemos enviado un email para restablecer tu contrasena');
    } catch {
      this.error.set('Error al enviar el email de recuperacion');
    }
  }

  getError(campo: string): string | null {
    const c = this.form.get(campo);
    if (!c?.invalid || !c.touched) return null;
    if (c.errors?.['required'])  return 'Campo obligatorio';
    if (c.errors?.['email'])     return 'Email no valido';
    if (c.errors?.['minlength']) return 'Minimo 6 caracteres';
    return null;
  }
}
