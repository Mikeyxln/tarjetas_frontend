export type TipoTarjeta = 'NORMAL' | 'TNE_ESCOLAR' | 'TNE_SUPERIOR' | 'ADULTO_MAYOR';

export type EstadoTarjeta = 'ACTIVA' | 'BLOQUEADA';

/** Tarjeta tal como la entrega la API (GET /api/tarjetas). Las fechas llegan como texto ISO. */
export interface Tarjeta {
  id: number;
  numero: string;
  titular: string;
  alias: string | null;
  tipo: TipoTarjeta;
  saldo: number;
  estado: EstadoTarjeta;
  creadaEn: string;
  actualizadaEn: string;
}

/** Datos para registrar una tarjeta (POST /api/tarjetas). El id y el estado los asigna el servidor. */
export interface TarjetaRequest {
  numero: string;
  titular: string;
  alias: string | null;
  tipo: TipoTarjeta;
  saldo: number;
}

/** Datos que se pueden editar (PUT /api/tarjetas/{id}). El número de tarjeta no cambia. */
export interface TarjetaEdicionRequest {
  titular: string;
  alias: string | null;
  tipo: TipoTarjeta;
  saldo: number;
  estado: EstadoTarjeta;
}

/** Reglas que el formulario repite para avisar antes de enviar (el backend las valida igual). */
export const REGLAS_TARJETA = {
  numeroPatron: /^\d{8,10}$/,
  titularMaxLargo: 100,
  aliasMaxLargo: 50,
  saldoMinimo: 0,
  saldoMaximo: 100000,
} as const;
