import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} er påkrevd',
    array: {
      must_be_array: '{{label}} må være en matrise',
      length_not_in_range: '{{label}}-arraylengden er ikke innenfor det angitte området',
      not_unique: '{{label}} matriseelementer kan ikke gjentas',
    },
    boolean: {
      must_be_boolean: '{{label}} må være en boolsk verdi',
    },
    buffer: {
      must_be_buffer: '{{label}} må være buffer',
    },
    stream: {
      must_be_stream: '{{label}} må være Stream',
    },
    date: {
      must_be_date: '{{label}} må være en dato',
      not_in_range: '{{label}} er ikke innenfor det tillatte tidsrommet',
    },
    number: {
      must_be_number: '{{label}} må være et tall',
      must_be_integer: '{{label}} må være et heltall',
      must_be_bigint: '{{label}} må være en BigInt',
      not_in_range: '{{label}} overskrider det tillatte verdiområdet',
    },
    string: {
      must_be_string: '{{label}} må være en streng',
      must_be_email: '{{label}} må være i e-postformat',
      must_be_hash: '{{label}} må være i hash-format',
      must_be_ip: '{{label}} må være en IP{{versions}}-adresse',
      must_be_ulid: '{{label}} må være i ULID-format',
      must_be_uuid: '{{label}} må være i UUID{{versions}}-format',
      length_not_in_range: '{{label}} lengde oppfyller ikke kravene',
      not_match_pattern: '{{label}} overholder ikke reglene',
    },
    object: {
      must_be_object: '{{label}} må være et objekt',
    },
    enum: {
      not_in_range: '{{label}} er ikke i oppregningsområdet',
      only_support_string_number_boolean:
        'Oppregningsverdier kan bare være strenger, tall og boolske verdier',
      value_can_not_be_empty: 'Oppregningsverdien kan ikke være en nullverdi "{{item}}"',
      ranges_can_not_be_empty: 'Opptellingsområdet kan ikke være tomt',
      default_not_in_range: 'Standardverdien "{{item}}" er ikke i oppregningsområdet',
    },
    literal: {
      not_match: '{{label}} er ikke den angitte verdien',
      unsupported_value: 'Støtter bare strenger, tall, booleaner og null',
    },
    one_of: {
      not_match_rule: '{{label}} overholder ikke reglene',
      match_multiple_rule: '{{label}} overholder mange regler',
    },
    any_of: {
      not_match_rule: '{{label}} overholder ikke reglene',
    },
    all_of: {
      not_match_all: '{{label}} oppfyller ikke alle reglene',
    },
    url: {
      must_be_url: '{{label}} må være i URL-format',
      unsupported_scheme:
        '{{label}} inneholder en URL-protokoll som ikke støttes: {{scheme}}',
    },
  },
});
