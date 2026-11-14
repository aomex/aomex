import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} hewce ye',
    array: {
      must_be_array: '{{label}} divê array be',
      length_not_in_range: 'Dirêjahiya array {{label}} ne di nav rêza diyarkirî de ye',
      not_unique: 'Hêmanên array {{label}} nayên dubare kirin',
    },
    boolean: {
      must_be_boolean: '{{label}} divê nirxek Boolean be',
    },
    buffer: {
      must_be_buffer: '{{label}} divê Buffer be',
    },
    stream: {
      must_be_stream: '{{label}} divê Stream be',
    },
    date: {
      must_be_date: '{{label}} divê dîrokek be',
      not_in_range: '{{label}} ne di nav rêza dema destûr de ye',
    },
    number: {
      must_be_number: '{{label}} divê jimarek be',
      must_be_integer: '{{label}} divê jimarek bêkêmasî be',
      must_be_bigint: '{{label}} divê BigInt be',
      not_in_range: '{{label}} ji rêza nirxa destûr derbas dibe',
    },
    string: {
      must_be_string: '{{label}} divê têl be',
      must_be_email: '{{label}} divê di forma e-nameyê de be',
      must_be_hash: '{{label}} divê di forma hash de be',
      must_be_ip: '{{label}} divê navnîşek IP{{versions}} be',
      must_be_ulid: '{{label}} divê di forma ULID de be',
      must_be_uuid: '{{label}} divê di forma UUID{{versions}} de be',
      length_not_in_range: 'Dirêjahiya {{label}} hewcedariyên xwe nagire',
      not_match_pattern: '{{label}} li gorî qaîdeyan tevnagere',
    },
    object: {
      must_be_object: '{{label}} divê objeyek be',
    },
    enum: {
      not_in_range: '{{label}} ne di nav rêza hejmartinê de ye',
      only_support_string_number_boolean:
        'Nirxên hejmartinê tenê dikarin rêzik, hejmar û nirxên Boolean bin',
      value_can_not_be_empty: 'Nirxa hejmartinê nikare bibe nirxek null "{{item}}"',
      ranges_can_not_be_empty: 'Rêjeya hejmartinê vala nabe',
      default_not_in_range: 'Nirxa xwerû "{{item}}" ne di nav rêza hejmartinê de ye',
    },
    literal: {
      not_match: '{{label}} ne nirxa diyarkirî ye',
      unsupported_value: 'Tenê rêzik, jimar, booleans, û null piştgirî dike',
    },
    one_of: {
      not_match_rule: '{{label}} li gorî qaîdeyan tevnagere',
      match_multiple_rule: '{{label}} bi gelek rêbazan re tevdigere',
    },
    any_of: {
      not_match_rule: '{{label}} li gorî qaîdeyan tevnagere',
    },
    all_of: {
      not_match_all: '{{label}} hemî qaîdeyan nagire',
    },
    url: {
      must_be_url: '{{label}} divê di forma URL-ê de be',
      unsupported_scheme:
        '{{label}} protokolek URL-ê ya ku nayê piştgirî kirin heye: {{scheme}}',
    },
  },
});
