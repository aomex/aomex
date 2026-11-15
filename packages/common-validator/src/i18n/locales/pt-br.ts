import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} é obrigatório',
    array: {
      must_be_array: '{{label}} deve ser uma matriz',
      length_not_in_range:
        'O comprimento da matriz {{label}} não está dentro do intervalo especificado',
      not_unique: 'Os elementos da matriz {{label}} não podem ser repetidos',
    },
    boolean: {
      must_be_boolean: '{{label}} deve ser um valor booleano',
    },
    buffer: {
      must_be_buffer: '{{label}} deve ser buffer',
    },
    stream: {
      must_be_stream: '{{label}} deve ser Stream',
    },
    date: {
      must_be_date: '{{label}} deve ser uma data',
      not_in_range: '{{label}} não está dentro do intervalo de tempo permitido',
    },
    number: {
      must_be_number: '{{label}} deve ser um número',
      must_be_integer: '{{label}} deve ser um número inteiro',
      must_be_bigint: '{{label}} deve ser um BigInt',
      must_be_decimal: '{{label}} deve ser um Decimal',
      not_in_range: '{{label}} excede a faixa de valores permitida',
    },
    string: {
      must_be_string: '{{label}} deve ser uma string',
      must_be_email: '{{label}} deve estar no formato de e-mail',
      must_be_hash: '{{label}} deve estar no formato hash',
      must_be_ip: '{{label}} deve ser um endereço IP{{versions}}',
      must_be_ulid: '{{label}} deve estar no formato ULID',
      must_be_uuid: '{{label}} deve estar no formato UUID{{versions}}',
      length_not_in_range: 'O comprimento {{label}} não atende aos requisitos',
      not_match_pattern: '{{label}} não cumpre as regras',
    },
    object: {
      must_be_object: '{{label}} deve ser um objeto',
    },
    enum: {
      not_in_range: '{{label}} não está no intervalo de enumeração',
      only_support_string_number_boolean:
        'Os valores de enumeração só podem ser strings, números e valores booleanos',
      value_can_not_be_empty:
        'O valor de enumeração não pode ser um valor nulo "{{item}}"',
      ranges_can_not_be_empty: 'O intervalo de enumeração não pode estar vazio',
      default_not_in_range:
        'O valor padrão "{{item}}" não está no intervalo de enumeração',
    },
    literal: {
      not_match: '{{label}} não é o valor especificado',
      unsupported_value: 'Suporta apenas strings, números, booleanos e nulos',
    },
    one_of: {
      not_match_rule: '{{label}} não cumpre as regras',
      match_multiple_rule: '{{label}} cumpre muitas regras',
    },
    any_of: {
      not_match_rule: '{{label}} não cumpre as regras',
    },
    all_of: {
      not_match_all: '{{label}} não atende a todas as regras',
    },
    url: {
      must_be_url: '{{label}} deve estar no formato URL',
      unsupported_scheme:
        '{{label}} contém um protocolo de URL não suportado: {{scheme}}',
    },
  },
});
