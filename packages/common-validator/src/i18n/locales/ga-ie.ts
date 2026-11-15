import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} ag teastáil',
    array: {
      must_be_array: 'Ní mór {{label}} a bheith ina eagar',
      length_not_in_range: 'Níl fad eagar {{label}} laistigh den raon sonraithe',
      not_unique: 'Ní féidir eilimintí eagar {{label}} a athdhéanamh',
    },
    boolean: {
      must_be_boolean: 'Caithfidh {{label}} a bheith ina luach Boole',
    },
    buffer: {
      must_be_buffer: 'Ní mór {{label}} a Mhaoláin',
    },
    stream: {
      must_be_stream: 'Caithfidh {{label}} a bheith Sruth',
    },
    date: {
      must_be_date: 'Caithfidh {{label}} a bheith ina dháta',
      not_in_range: 'Níl {{label}} laistigh den raon ama ceadaithe',
    },
    number: {
      must_be_number: 'Caithfidh {{label}} a bheith ina uimhir',
      must_be_integer: 'Ní mór {{label}} a bheith ina slánuimhir',
      must_be_bigint: 'Caithfidh {{label}} a bheith ina BigInt',
      must_be_decimal: 'Caithfidh {{label}} a bheith ina Decimal',
      not_in_range: 'Sáraíonn {{label}} an raon luach ceadaithe',
    },
    string: {
      must_be_string: 'Ní mór {{label}} a bheith ina teaghrán',
      must_be_email: 'Ní mór {{label}} a bheith i bhformáid ríomhphoist',
      must_be_hash: 'Ní mór {{label}} a bheith i bhformáid hash',
      must_be_ip: 'Ní mór seoladh IP{{versions}} a bheith ag {{label}}',
      must_be_ulid: 'Caithfidh {{label}} a bheith i bhformáid ULID',
      must_be_uuid: 'Caithfidh {{label}} a bheith i bhformáid UUIDZ{{versions}}',
      length_not_in_range: 'Ní chomhlíonann fad {{label}} na ceanglais',
      not_match_pattern: 'Ní chloíonn {{label}} leis na rialacha',
    },
    object: {
      must_be_object: 'Caithfidh {{label}} a bheith ina réad',
    },
    enum: {
      not_in_range: 'Níl {{label}} sa raon áirimh',
      only_support_string_number_boolean:
        'Ní féidir a bheith i luachanna áirimh ach teaghráin, uimhreacha agus luachanna Boole',
      value_can_not_be_empty:
        'Ní féidir luach nialasach "{{item}}" a bheith sa luach áirimh',
      ranges_can_not_be_empty: 'Ní féidir leis an raon áirimh a bheith folamh',
      default_not_in_range: 'Níl an luach réamhshocraithe "{{item}}" sa raon áirimh',
    },
    literal: {
      not_match: 'Ní {{label}} an luach sonraithe',
      unsupported_value: 'Ní thacaíonn ach teaghráin, uimhreacha, booleans, agus null',
    },
    one_of: {
      not_match_rule: 'Ní chloíonn {{label}} leis na rialacha',
      match_multiple_rule: 'Comhlíonann {{label}} go leor rialacha',
    },
    any_of: {
      not_match_rule: 'Ní chloíonn {{label}} leis na rialacha',
    },
    all_of: {
      not_match_all: 'Ní chomhlíonann {{label}} na rialacha go léir',
    },
    url: {
      must_be_url: 'Caithfidh {{label}} a bheith i bhformáid URL',
      unsupported_scheme: 'Tá prótacal URL nach dtacaítear leis ag {{label}}: {{scheme}}',
    },
  },
});
