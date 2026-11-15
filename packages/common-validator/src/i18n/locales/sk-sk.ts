import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Vyžaduje sa {{label}}',
    array: {
      must_be_array: '{{label}} musí byť pole',
      length_not_in_range: 'Dĺžka poľa {{label}} nie je v špecifikovanom rozsahu',
      not_unique: 'Prvky poľa {{label}} sa nemôžu opakovať',
    },
    boolean: {
      must_be_boolean: '{{label}} musí byť boolovská hodnota',
    },
    buffer: {
      must_be_buffer: '{{label}} musí byť vyrovnávacia pamäť',
    },
    stream: {
      must_be_stream: '{{label}} musí byť Stream',
    },
    date: {
      must_be_date: '{{label}} musí byť dátum',
      not_in_range: '{{label}} nie je v povolenom časovom rozsahu',
    },
    number: {
      must_be_number: '{{label}} musí byť číslo',
      must_be_integer: '{{label}} musí byť celé číslo',
      must_be_bigint: '{{label}} musí byť BigInt',
      must_be_decimal: '{{label}} musí byť Decimal',
      not_in_range: '{{label}} prekračuje povolený rozsah hodnôt',
    },
    string: {
      must_be_string: '{{label}} musí byť reťazec',
      must_be_email: '{{label}} musí byť vo formáte e-mailu',
      must_be_hash: '{{label}} musí byť vo formáte hash',
      must_be_ip: '{{label}} musí byť adresa IP{{versions}}',
      must_be_ulid: '{{label}} musí byť vo formáte ULID',
      must_be_uuid: '{{label}} musí byť vo formáte UUID{{versions}}',
      length_not_in_range: 'Dĺžka {{label}} nespĺňa požiadavky',
      not_match_pattern: '{{label}} nevyhovuje pravidlám',
    },
    object: {
      must_be_object: '{{label}} musí byť objekt',
    },
    enum: {
      not_in_range: '{{label}} nie je v rozsahu enumerácie',
      only_support_string_number_boolean:
        'Hodnoty enumerácie môžu byť iba reťazce, čísla a boolovské hodnoty',
      value_can_not_be_empty: 'Hodnota enumerácie nemôže byť nulová hodnota "{{item}}"',
      ranges_can_not_be_empty: 'Rozsah enumerácie nemôže byť prázdny',
      default_not_in_range: 'Predvolená hodnota "{{item}}" nie je v rozsahu enumerácie',
    },
    literal: {
      not_match: '{{label}} nie je špecifikovaná hodnota',
      unsupported_value: 'Podporuje iba reťazce, čísla, boolovské hodnoty a hodnoty null',
    },
    one_of: {
      not_match_rule: '{{label}} nevyhovuje pravidlám',
      match_multiple_rule: '{{label}} vyhovuje mnohým pravidlám',
    },
    any_of: {
      not_match_rule: '{{label}} nevyhovuje pravidlám',
    },
    all_of: {
      not_match_all: '{{label}} nespĺňa všetky pravidlá',
    },
    url: {
      must_be_url: '{{label}} musí byť vo formáte adresy URL',
      unsupported_scheme: '{{label}} obsahuje nepodporovaný protokol URL: {{scheme}}',
    },
  },
});
