import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} պարտադիր է',
    array: {
      must_be_array: '{{label}}-ը պետք է լինի զանգված',
      length_not_in_range: '{{label}} զանգվածի երկարությունը նշված տիրույթում չէ',
      not_unique: '{{label}} զանգվածի տարրերը չեն կարող կրկնվել',
    },
    boolean: {
      must_be_boolean: '{{label}}-ը պետք է լինի բուլյան արժեք',
    },
    buffer: {
      must_be_buffer: '{{label}}-ը պետք է լինի Buffer',
    },
    stream: {
      must_be_stream: '{{label}}-ը պետք է լինի հոսք',
    },
    date: {
      must_be_date: '{{label}}-ը պետք է լինի ամսաթիվ',
      not_in_range: '{{label}}-ը թույլատրելի ժամանակային միջակայքում չէ',
    },
    number: {
      must_be_number: '{{label}} պետք է լինի թիվ',
      must_be_integer: '{{label}}-ը պետք է լինի ամբողջ թիվ',
      must_be_bigint: '{{label}}-ը պետք է լինի BigInt',
      not_in_range: '{{label}}-ը գերազանցում է թույլատրելի արժեքների միջակայքը',
    },
    string: {
      must_be_string: '{{label}}-ը պետք է լինի տող',
      must_be_email: '{{label}}-ը պետք է լինի էլփոստի ձևաչափով',
      must_be_hash: '{{label}}-ը պետք է լինի հեշ ձևաչափով',
      must_be_ip: '{{label}}-ը պետք է լինի IP{{versions}} հասցե',
      must_be_ulid: '{{label}}-ը պետք է լինի ULID ձևաչափով',
      must_be_uuid: '{{label}}-ը պետք է լինի UUID{{versions}} ձևաչափով',
      length_not_in_range: '{{label}} երկարությունը չի համապատասխանում պահանջներին',
      not_match_pattern: '{{label}}-ը չի համապատասխանում կանոններին',
    },
    object: {
      must_be_object: '{{label}}-ը պետք է լինի օբյեկտ',
    },
    enum: {
      not_in_range: '{{label}}-ը թվային տիրույթում չէ',
      only_support_string_number_boolean:
        'Թվարկման արժեքները կարող են լինել միայն տողեր, թվեր և բուլյան արժեքներ',
      value_can_not_be_empty: 'Թվարկման արժեքը չի կարող լինել «{{item}}» զրոյական արժեք',
      ranges_can_not_be_empty: 'Թվարկման տիրույթը չի կարող դատարկ լինել',
      default_not_in_range: '«{{item}}» կանխադրված արժեքը թվարկման տիրույթում չէ',
    },
    literal: {
      not_match: '{{label}}-ը նշված արժեքը չէ',
      unsupported_value: 'Աջակցում է միայն տողեր, թվեր, բուլյաններ և զրո',
    },
    one_of: {
      not_match_rule: '{{label}}-ը չի համապատասխանում կանոններին',
      match_multiple_rule: '{{label}}-ը համապատասխանում է բազմաթիվ կանոնների',
    },
    any_of: {
      not_match_rule: '{{label}}-ը չի համապատասխանում կանոններին',
    },
    all_of: {
      not_match_all: '{{label}}-ը չի համապատասխանում բոլոր կանոններին',
    },
    url: {
      must_be_url: '{{label}}-ը պետք է լինի URL ձևաչափով',
      unsupported_scheme:
        '{{label}} պարունակում է չաջակցվող URL արձանագրություն՝ {{scheme}}',
    },
  },
});
