import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { EstadoTarjeta, REGLAS_TARJETA, TipoTarjeta } from '../../core/models/tarjeta.model';
import { ESTADOS_TARJETA, TIPOS_TARJETA } from './tarjeta-labels';
import { TarjetasStore } from './tarjetas.store';

/**
 * Pantalla de formulario reutilizada para CREAR (/tarjetas/nueva) y EDITAR (/tarjetas/:id/editar).
 * El router entrega el parámetro :id como input gracias a withComponentInputBinding().
 */
@Component({
  selector: 'app-tarjeta-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tarjeta-form.page.html',
  styleUrl: './tarjeta-form.page.css',
})
export class TarjetaFormPage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(TarjetasStore);
  private readonly router = inject(Router);

  /** Viene de la URL. Si no existe, estamos creando. */
  readonly id = input<string>();

  protected readonly tipos = TIPOS_TARJETA;
  protected readonly estados = ESTADOS_TARJETA;
  protected readonly reglas = REGLAS_TARJETA;

  protected readonly esEdicion = computed(() => this.id() !== undefined);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly erroresServidor = signal<string[]>([]);

  protected readonly form = this.fb.group({
    numero: ['', [Validators.required, Validators.pattern(REGLAS_TARJETA.numeroPatron)]],
    titular: ['', [Validators.required, Validators.maxLength(REGLAS_TARJETA.titularMaxLargo)]],
    alias: ['', [Validators.maxLength(REGLAS_TARJETA.aliasMaxLargo)]],
    tipo: ['NORMAL' as TipoTarjeta, [Validators.required]],
    saldo: [
      0,
      [
        Validators.required,
        Validators.min(REGLAS_TARJETA.saldoMinimo),
        Validators.max(REGLAS_TARJETA.saldoMaximo),
      ],
    ],
    estado: ['ACTIVA' as EstadoTarjeta, [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.id();
    if (id === undefined) return;

    // En edición el número no se puede cambiar.
    this.form.controls.numero.disable();
    this.cargando.set(true);
    this.store.obtener(Number(id)).subscribe({
      next: (tarjeta) => {
        this.form.patchValue({ ...tarjeta, alias: tarjeta.alias ?? '' });
        this.cargando.set(false);
      },
      error: (e: Error) => {
        this.errorCarga.set(e.message);
        this.cargando.set(false);
      },
    });
  }

  /** ¿El campo es inválido y el usuario ya lo tocó? */
  protected invalido(nombre: 'numero' | 'titular' | 'alias' | 'tipo' | 'saldo' | 'estado'): boolean {
    const control = this.form.controls[nombre];
    return control.invalid && (control.touched || control.dirty);
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.erroresServidor.set([]);

    const v = this.form.getRawValue();
    const alias = v.alias.trim() || null;
    const id = this.id();

    const operacion =
      id === undefined
        ? this.store.crear({ numero: v.numero.trim(), titular: v.titular.trim(), alias, tipo: v.tipo, saldo: v.saldo })
        : this.store.actualizar(Number(id), {
            titular: v.titular.trim(),
            alias,
            tipo: v.tipo,
            saldo: v.saldo,
            estado: v.estado,
          });

    // Si el servidor rechaza, el store ya mostró el aviso y no emite: se reactiva el botón.
    operacion.subscribe({
      next: () => void this.router.navigate(['/tarjetas']),
      complete: () => this.guardando.set(false),
    });
  }
}
