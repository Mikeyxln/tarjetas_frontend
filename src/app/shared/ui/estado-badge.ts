import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EstadoTarjeta } from '../../core/models/tarjeta.model';

/** Componente "tonto" (presentacional): solo recibe datos por input y los dibuja. */
@Component({
  selector: 'app-estado-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class.badge-ok]="estado() === 'ACTIVA'" [class.badge-off]="estado() === 'BLOQUEADA'">
      {{ estado() === 'ACTIVA' ? 'Activa' : 'Bloqueada' }}
    </span>
  `,
  styles: `
    .badge { display: inline-block; padding: .15rem .6rem; border-radius: 999px; font-size: .75rem; font-weight: 600; }
    .badge-ok { background: #dcfce7; color: #166534; }
    .badge-off { background: #fee2e2; color: #991b1b; }
  `,
})
export class EstadoBadge {
  readonly estado = input.required<EstadoTarjeta>();
}
