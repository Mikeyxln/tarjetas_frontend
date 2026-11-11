import { EstadoTarjeta, TipoTarjeta } from '../../core/models/tarjeta.model';

/** Textos para mostrar en pantalla (son cosas de la vista, por eso no están en el modelo). */
export const TIPOS_TARJETA: ReadonlyArray<{ valor: TipoTarjeta; texto: string }> = [
  { valor: 'NORMAL', texto: 'Normal' },
  { valor: 'TNE_ESCOLAR', texto: 'TNE Escolar' },
  { valor: 'TNE_SUPERIOR', texto: 'TNE Educación Superior' },
  { valor: 'ADULTO_MAYOR', texto: 'Adulto Mayor' },
];

export const ESTADOS_TARJETA: ReadonlyArray<{ valor: EstadoTarjeta; texto: string }> = [
  { valor: 'ACTIVA', texto: 'Activa' },
  { valor: 'BLOQUEADA', texto: 'Bloqueada' },
];

export function textoTipo(tipo: TipoTarjeta): string {
  return TIPOS_TARJETA.find((t) => t.valor === tipo)?.texto ?? tipo;
}
