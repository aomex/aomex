import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Es requereix {{label}}',
    array: {
      must_be_array: '{{label}} ha de ser una matriu',
      length_not_in_range:
        "La longitud de la matriu {{label}} no es troba dins de l'interval especificat",
      not_unique: 'Els elements de la matriu {{label}} no es poden repetir',
    },
    boolean: {
      must_be_boolean: '{{label}} ha de ser un valor booleà',
    },
    buffer: {
      must_be_buffer: '{{label}} ha de ser Buffer',
    },
    stream: {
      must_be_stream: '{{label}} ha de ser Stream',
    },
    date: {
      must_be_date: '{{label}} ha de ser una cita',
      not_in_range: "{{label}} no es troba dins de l'interval de temps permès",
    },
    number: {
      must_be_number: '{{label}} ha de ser un número',
      must_be_integer: '{{label}} ha de ser un nombre enter',
      must_be_bigint: '{{label}} ha de ser un BigInt',
      not_in_range: "{{label}} supera l'interval de valors permès",
    },
    string: {
      must_be_string: '{{label}} ha de ser una cadena',
      must_be_email: "{{label}} ha d'estar en format de correu electrònic",
      must_be_hash: "{{label}} ha d'estar en format hash",
      must_be_ip: '{{label}} ha de ser una adreça IP{{versions}}',
      must_be_ulid: "{{label}} ha d'estar en format ULID",
      must_be_uuid: "{{label}} ha d'estar en format UUID{{versions}}",
      length_not_in_range: 'La longitud {{label}} no compleix els requisits',
      not_match_pattern: '{{label}} no compleix les normes',
    },
    object: {
      must_be_object: '{{label}} ha de ser un objecte',
    },
    enum: {
      not_in_range: "{{label}} no es troba a l'interval d'enumeració",
      only_support_string_number_boolean:
        "Els valors d'enumeració només poden ser cadenes, números i valors booleans",
      value_can_not_be_empty: 'El valor d\'enumeració no pot ser un valor nul "{{item}}"',
      ranges_can_not_be_empty: "L'interval d'enumeració no pot estar buit",
      default_not_in_range:
        'El valor per defecte "{{item}}" no es troba a l\'interval d\'enumeració',
    },
    literal: {
      not_match: '{{label}} no és el valor especificat',
      unsupported_value: 'Només admet cadenes, números, booleans i null',
    },
    one_of: {
      not_match_rule: '{{label}} no compleix les normes',
      match_multiple_rule: '{{label}} compleix moltes regles',
    },
    any_of: {
      not_match_rule: '{{label}} no compleix les normes',
    },
    all_of: {
      not_match_all: '{{label}} no compleix totes les regles',
    },
    url: {
      must_be_url: "{{label}} ha d'estar en format URL",
      unsupported_scheme: "{{label}} conté un protocol d'URL no compatible: {{scheme}}",
    },
  },
});
