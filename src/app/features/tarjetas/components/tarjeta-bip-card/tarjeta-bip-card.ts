import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Tarjeta } from '../../../../core/models/tarjeta.model';
import { ClpPipe } from '../../../../shared/ui/clp.pipe';
import { EstadoBadge } from '../../../../shared/ui/estado-badge';
import { textoTipo } from '../../tarjeta-labels';

/** Componente de presentación: dibuja UNA tarjeta y avisa al padre con outputs (no llama al backend). */
@Component({
  selector: 'app-tarjeta-bip-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ClpPipe, EstadoBadge],
  templateUrl: './tarjeta-bip-card.html',
  styleUrl: './tarjeta-bip-card.css',
})
export class TarjetaBipCard {
  readonly tarjeta = input.required<Tarjeta>();
  readonly eliminar = output<Tarjeta>();

  protected readonly numeroFormateado = computed(() =>
    this.tarjeta().numero.replace(/(\d{4})(?=\d)/g, '$1 '),
  );
  protected readonly tipoTexto = computed(() => textoTipo(this.tarjeta().tipo));
}
