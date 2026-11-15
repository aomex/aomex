import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} è obbligatorio',
    array: {
      must_be_array: '{{label}} deve essere un array',
      length_not_in_range:
        "La lunghezza dell'array {{label}} non rientra nell'intervallo specificato",
      not_unique: "Gli elementi dell'array {{label}} non possono essere ripetuti",
    },
    boolean: {
      must_be_boolean: '{{label}} deve essere un valore booleano',
    },
    buffer: {
      must_be_buffer: '{{label}} deve essere Buffer',
    },
    stream: {
      must_be_stream: '{{label}} deve essere Stream',
    },
    date: {
      must_be_date: '{{label}} deve essere una data',
      not_in_range: "{{label}} non rientra nell'intervallo di tempo consentito",
    },
    number: {
      must_be_number: '{{label}} deve essere un numero',
      must_be_integer: '{{label}} deve essere un numero intero',
      must_be_bigint: '{{label}} deve essere un BigInt',
      must_be_decimal: '{{label}} deve essere un Decimal',
      not_in_range: "{{label}} supera l'intervallo di valori consentito",
    },
    string: {
      must_be_string: '{{label}} deve essere una stringa',
      must_be_email: '{{label}} deve essere in formato email',
      must_be_hash: '{{label}} deve essere in formato hash',
      must_be_ip: '{{label}} deve essere un indirizzo IP{{versions}}',
      must_be_ulid: '{{label}} deve essere in formato ULID',
      must_be_uuid: '{{label}} deve essere nel formato UUID{{versions}}',
      length_not_in_range: 'La lunghezza {{label}} non soddisfa i requisiti',
      not_match_pattern: '{{label}} non rispetta le regole',
    },
    object: {
      must_be_object: '{{label}} deve essere un oggetto',
    },
    enum: {
      not_in_range: "{{label}} non è nell'intervallo di enumerazione",
      only_support_string_number_boolean:
        'I valori di enumerazione possono essere solo stringhe, numeri e valori booleani',
      value_can_not_be_empty:
        'Il valore dell\'enumerazione non può essere un valore null "{{item}}"',
      ranges_can_not_be_empty: "L'intervallo di enumerazione non può essere vuoto",
      default_not_in_range:
        'Il valore predefinito "{{item}}" non è compreso nell\'intervallo di enumerazione',
    },
    literal: {
      not_match: '{{label}} non è il valore specificato',
      unsupported_value: 'Supporta solo stringhe, numeri, booleani e null',
    },
    one_of: {
      not_match_rule: '{{label}} non rispetta le regole',
      match_multiple_rule: '{{label}} rispetta molte regole',
    },
    any_of: {
      not_match_rule: '{{label}} non rispetta le regole',
    },
    all_of: {
      not_match_all: '{{label}} non soddisfa tutte le regole',
    },
    url: {
      must_be_url: '{{label}} deve essere nel formato URL',
      unsupported_scheme:
        '{{label}} contiene un protocollo URL non supportato: {{scheme}}',
    },
  },
});
