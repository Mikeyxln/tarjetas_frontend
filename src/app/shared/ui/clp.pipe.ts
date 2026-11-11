import { Pipe, PipeTransform } from '@angular/core';

/** Formatea un número como pesos chilenos: 4000 -> $4.000 */
@Pipe({ name: 'clp' })
export class ClpPipe implements PipeTransform {
  private readonly formato = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

  transform(valor: number | null | undefined): string {
    return valor === null || valor === undefined ? '' : this.formato.format(valor);
  }
}
