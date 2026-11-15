import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} vaaditaan',
    array: {
      must_be_array: '{{label}} on oltava taulukko',
      length_not_in_range: '{{label}}-taulukon pituus ei ole määritetyllä alueella',
      not_unique: '{{label}}-taulukon elementtejä ei voi toistaa',
    },
    boolean: {
      must_be_boolean: '{{label}} on oltava Boolen arvo',
    },
    buffer: {
      must_be_buffer: '{{label}}:n on oltava puskuri',
    },
    stream: {
      must_be_stream: '{{label}}:n on oltava Stream',
    },
    date: {
      must_be_date: '{{label}} on oltava päivämäärä',
      not_in_range: '{{label}} ei ole sallitulla aikavälillä',
    },
    number: {
      must_be_number: '{{label}} on oltava numero',
      must_be_integer: '{{label}} on oltava kokonaisluku',
      must_be_bigint: '{{label}}:n on oltava BigInt',
      must_be_decimal: '{{label}}:n on oltava Decimal',
      not_in_range: '{{label}} ylittää sallitun arvoalueen',
    },
    string: {
      must_be_string: '{{label}} on oltava merkkijono',
      must_be_email: '{{label}} on oltava sähköpostimuodossa',
      must_be_hash: '{{label}} on oltava hash-muodossa',
      must_be_ip: '{{label}}:n on oltava IP{{versions}}-osoite',
      must_be_ulid: '{{label}} on oltava ULID-muodossa',
      must_be_uuid: '{{label}}:n on oltava muodossa UUID{{versions}}',
      length_not_in_range: '{{label}} pituus ei täytä vaatimuksia',
      not_match_pattern: '{{label}} ei noudata sääntöjä',
    },
    object: {
      must_be_object: '{{label}}:n on oltava objekti',
    },
    enum: {
      not_in_range: '{{label}} ei ole luettelointialueella',
      only_support_string_number_boolean:
        'Luetteloarvot voivat olla vain merkkijonoja, numeroita ja Boolen arvoja',
      value_can_not_be_empty: 'Luetteloarvo ei voi olla nollaarvo "{{item}}"',
      ranges_can_not_be_empty: 'Luetteloväli ei voi olla tyhjä',
      default_not_in_range: 'Oletusarvo "{{item}}" ei ole luettelointialueella',
    },
    literal: {
      not_match: '{{label}} ei ole määritetty arvo',
      unsupported_value: 'Tukee vain merkkijonoja, numeroita, loogisia arvoja ja nollia',
    },
    one_of: {
      not_match_rule: '{{label}} ei noudata sääntöjä',
      match_multiple_rule: '{{label}} noudattaa monia sääntöjä',
    },
    any_of: {
      not_match_rule: '{{label}} ei noudata sääntöjä',
    },
    all_of: {
      not_match_all: '{{label}} ei täytä kaikkia sääntöjä',
    },
    url: {
      must_be_url: '{{label}} on oltava URL-muodossa',
      unsupported_scheme: '{{label}} sisältää URL-protokollan, jota ei tueta: {{scheme}}',
    },
  },
});
