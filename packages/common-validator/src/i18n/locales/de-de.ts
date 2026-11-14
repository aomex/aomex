import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} ist erforderlich',
    array: {
      must_be_array: '{{label}} muss ein Array sein',
      length_not_in_range:
        'Die Länge des {{label}}-Arrays liegt nicht im angegebenen Bereich',
      not_unique: '{{label}}-Array-Elemente können nicht wiederholt werden',
    },
    boolean: {
      must_be_boolean: '{{label}} muss ein boolescher Wert sein',
    },
    buffer: {
      must_be_buffer: '{{label}} muss Puffer sein',
    },
    stream: {
      must_be_stream: '{{label}} muss Stream sein',
    },
    date: {
      must_be_date: '{{label}} muss ein Datum sein',
      not_in_range: '{{label}} liegt nicht im zulässigen Zeitbereich',
    },
    number: {
      must_be_number: '{{label}} muss eine Zahl sein',
      must_be_integer: '{{label}} muss eine Ganzzahl sein',
      must_be_bigint: '{{label}} muss ein BigInt sein',
      not_in_range: '{{label}} überschreitet den zulässigen Wertebereich',
    },
    string: {
      must_be_string: '{{label}} muss eine Zeichenfolge sein',
      must_be_email: '{{label}} muss im E-Mail-Format vorliegen',
      must_be_hash: '{{label}} muss im Hash-Format vorliegen',
      must_be_ip: '{{label}} muss eine IP{{versions}}-Adresse sein',
      must_be_ulid: '{{label}} muss im ULID-Format vorliegen',
      must_be_uuid: '{{label}} muss im UUID{{versions}}-Format vorliegen',
      length_not_in_range: 'Die Länge {{label}} entspricht nicht den Anforderungen',
      not_match_pattern: '{{label}} hält sich nicht an die Regeln',
    },
    object: {
      must_be_object: '{{label}} muss ein Objekt sein',
    },
    enum: {
      not_in_range: '{{label}} liegt nicht im Aufzählungsbereich',
      only_support_string_number_boolean:
        'Aufzählungswerte können nur Zeichenfolgen, Zahlen und boolesche Werte sein',
      value_can_not_be_empty: 'Der Enumerationswert darf kein Nullwert „{{item}}“ sein.',
      ranges_can_not_be_empty: 'Der Aufzählungsbereich darf nicht leer sein',
      default_not_in_range:
        'Der Standardwert „{{item}}“ liegt nicht im Aufzählungsbereich',
    },
    literal: {
      not_match: '{{label}} ist nicht der angegebene Wert',
      unsupported_value:
        'Unterstützt nur Zeichenfolgen, Zahlen, boolesche Werte und Null',
    },
    one_of: {
      not_match_rule: '{{label}} hält sich nicht an die Regeln',
      match_multiple_rule: '{{label}} erfüllt viele Regeln',
    },
    any_of: {
      not_match_rule: '{{label}} hält sich nicht an die Regeln',
    },
    all_of: {
      not_match_all: '{{label}} erfüllt nicht alle Regeln',
    },
    url: {
      must_be_url: '{{label}} muss im URL-Format vorliegen',
      unsupported_scheme:
        '{{label}} enthält ein nicht unterstütztes URL-Protokoll: {{scheme}}',
    },
  },
});
