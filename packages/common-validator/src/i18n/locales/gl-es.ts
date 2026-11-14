import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} é necesario',
    array: {
      must_be_array: '{{label}} debe ser unha matriz',
      length_not_in_range:
        'A lonxitude da matriz {{label}} non está dentro do intervalo especificado',
      not_unique: 'Os elementos da matriz {{label}} non se poden repetir',
    },
    boolean: {
      must_be_boolean: '{{label}} debe ser un valor booleano',
    },
    buffer: {
      must_be_buffer: '{{label}} debe ser un buffer',
    },
    stream: {
      must_be_stream: '{{label}} debe ser Stream',
    },
    date: {
      must_be_date: '{{label}} debe ser unha cita',
      not_in_range: '{{label}} non está dentro do intervalo de tempo permitido',
    },
    number: {
      must_be_number: '{{label}} debe ser un número',
      must_be_integer: '{{label}} debe ser un número enteiro',
      must_be_bigint: '{{label}} debe ser un BigInt',
      not_in_range: '{{label}} supera o intervalo de valores permitido',
    },
    string: {
      must_be_string: '{{label}} debe ser unha cadea',
      must_be_email: '{{label}} debe estar en formato de correo electrónico',
      must_be_hash: '{{label}} debe estar en formato hash',
      must_be_ip: '{{label}} debe ser un enderezo IP{{versions}}',
      must_be_ulid: '{{label}} debe estar en formato ULID',
      must_be_uuid: '{{label}} debe estar en formato UUID{{versions}}',
      length_not_in_range: 'A lonxitude {{label}} non cumpre os requisitos',
      not_match_pattern: '{{label}} non cumpre coas regras',
    },
    object: {
      must_be_object: '{{label}} debe ser un obxecto',
    },
    enum: {
      not_in_range: '{{label}} non está no intervalo de enumeración',
      only_support_string_number_boolean:
        'Os valores de enumeración só poden ser cadeas, números e valores booleanos',
      value_can_not_be_empty:
        'O valor de enumeración non pode ser un valor nulo "{{item}}"',
      ranges_can_not_be_empty: 'O intervalo de enumeración non pode estar baleiro',
      default_not_in_range:
        'O valor predeterminado "{{item}}" non está no intervalo de enumeración',
    },
    literal: {
      not_match: '{{label}} non é o valor especificado',
      unsupported_value: 'Só admite cadeas, números, booleanos e nulos',
    },
    one_of: {
      not_match_rule: '{{label}} non cumpre coas regras',
      match_multiple_rule: '{{label}} cumpre con moitas regras',
    },
    any_of: {
      not_match_rule: '{{label}} non cumpre coas regras',
    },
    all_of: {
      not_match_all: '{{label}} non cumpre todas as regras',
    },
    url: {
      must_be_url: '{{label}} debe estar en formato URL',
      unsupported_scheme: '{{label}} contén un protocolo URL non compatible: {{scheme}}',
    },
  },
});
