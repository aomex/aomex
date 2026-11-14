import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Se requiere {{label}}',
    array: {
      must_be_array: '{{label}} debe ser una matriz',
      length_not_in_range:
        'La longitud de la matriz {{label}} no está dentro del rango especificado',
      not_unique: 'Los elementos de la matriz {{label}} no se pueden repetir',
    },
    boolean: {
      must_be_boolean: '{{label}} debe ser un valor booleano',
    },
    buffer: {
      must_be_buffer: '{{label}} debe ser búfer',
    },
    stream: {
      must_be_stream: '{{label}} debe ser Stream',
    },
    date: {
      must_be_date: '{{label}} debe ser una cita',
      not_in_range: '{{label}} no está dentro del rango de tiempo permitido',
    },
    number: {
      must_be_number: '{{label}} debe ser un número',
      must_be_integer: '{{label}} debe ser un número entero',
      must_be_bigint: '{{label}} debe ser un BigInt',
      not_in_range: '{{label}} excede el rango de valores permitido',
    },
    string: {
      must_be_string: '{{label}} debe ser una cadena',
      must_be_email: '{{label}} debe estar en formato de correo electrónico.',
      must_be_hash: '{{label}} debe estar en formato hash',
      must_be_ip: '{{label}} debe ser una dirección IP{{versions}}',
      must_be_ulid: '{{label}} debe estar en formato ULID',
      must_be_uuid: '{{label}} debe estar en formato UUID{{versions}}',
      length_not_in_range: 'La longitud {{label}} no cumple con los requisitos.',
      not_match_pattern: '{{label}} no cumple con las reglas.',
    },
    object: {
      must_be_object: '{{label}} debe ser un objeto',
    },
    enum: {
      not_in_range: '{{label}} no está en el rango de enumeración',
      only_support_string_number_boolean:
        'Los valores de enumeración solo pueden ser cadenas, números y valores booleanos.',
      value_can_not_be_empty:
        'El valor de la enumeración no puede ser un valor nulo "{{item}}"',
      ranges_can_not_be_empty: 'El rango de enumeración no puede estar vacío.',
      default_not_in_range:
        'El valor predeterminado "{{item}}" no está en el rango de enumeración',
    },
    literal: {
      not_match: '{{label}} no es el valor especificado',
      unsupported_value: 'Solo admite cadenas, números, valores booleanos y nulos',
    },
    one_of: {
      not_match_rule: '{{label}} no cumple con las reglas.',
      match_multiple_rule: '{{label}} cumple con muchas reglas',
    },
    any_of: {
      not_match_rule: '{{label}} no cumple con las reglas.',
    },
    all_of: {
      not_match_all: '{{label}} no cumple todas las reglas',
    },
    url: {
      must_be_url: '{{label}} debe estar en formato URL',
      unsupported_scheme: '{{label}} contiene un protocolo URL no compatible: {{scheme}}',
    },
  },
});
