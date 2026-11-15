import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} talap edilýär',
    array: {
      must_be_array: '{{label}} bir massiw bolmaly',
      length_not_in_range: '{{label}} massiwiniň uzynlygy görkezilen çäkde däl',
      not_unique: '{{label}} massiw elementlerini gaýtalap bolmaz',
    },
    boolean: {
      must_be_boolean: '{{label}} Boolean bahasy bolmaly',
    },
    buffer: {
      must_be_buffer: '{{label}} bufer bolmaly',
    },
    stream: {
      must_be_stream: '{{label}} Akym bolmaly',
    },
    date: {
      must_be_date: '{{label}} senesi bolmaly',
      not_in_range: '{{label}} rugsat berlen möhletde däl',
    },
    number: {
      must_be_number: '{{label}} san bolmaly',
      must_be_integer: '{{label}} bitewi san bolmaly',
      must_be_bigint: '{{label}} BigInt bolmaly',
      must_be_decimal: '{{label}} Decimal bolmaly',
      not_in_range: '{{label}} rugsat edilen bahadan ýokary',
    },
    string: {
      must_be_string: '{{label}} setir bolmaly',
      must_be_email: '{{label}} e-poçta görnüşinde bolmaly',
      must_be_hash: '{{label}} hash görnüşinde bolmaly',
      must_be_ip: '{{label}} IP{{versions}} salgy bolmaly',
      must_be_ulid: '{{label}} ULID formatda bolmaly',
      must_be_uuid: '{{label}} UUID{{versions}} formatda bolmaly',
      length_not_in_range: '{{label}} uzynlygy talaplara laýyk gelmeýär',
      not_match_pattern: '{{label}} düzgünleri ýerine ýetirmeýär',
    },
    object: {
      must_be_object: '{{label}} obýekt bolmaly',
    },
    enum: {
      not_in_range: '{{label}} sanamak çäginde däl',
      only_support_string_number_boolean:
        'Hasaplama bahalary diňe setirler, sanlar we Boolean bahalary bolup biler',
      value_can_not_be_empty: 'Hasaplaýyş gymmaty "{{item}}" bolup bilmez.',
      ranges_can_not_be_empty: 'Sanaw aralygy boş bolup bilmez',
      default_not_in_range: 'Bellenen baha "{{item}}" sanamak çäginde däl',
    },
    literal: {
      not_match: '{{label}} görkezilen baha däl',
      unsupported_value: 'Diňe setirleri, sanlary, bulanlary we nulllary goldaýar',
    },
    one_of: {
      not_match_rule: '{{label}} düzgünleri ýerine ýetirmeýär',
      match_multiple_rule: '{{label}} köp düzgüne laýyk gelýär',
    },
    any_of: {
      not_match_rule: '{{label}} düzgünleri ýerine ýetirmeýär',
    },
    all_of: {
      not_match_all: '{{label}} ähli düzgünlere laýyk gelmeýär',
    },
    url: {
      must_be_url: '{{label}} URL görnüşinde bolmaly',
      unsupported_scheme:
        '{{label}} goldanmaýan URL protokolyny öz içine alýar: {{scheme}}',
    },
  },
});
