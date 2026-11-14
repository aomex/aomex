import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} қажет',
    array: {
      must_be_array: '{{label}} массив болуы керек',
      length_not_in_range: '{{label}} жиым ұзындығы көрсетілген ауқымда емес',
      not_unique: '{{label}} массив элементтерін қайталау мүмкін емес',
    },
    boolean: {
      must_be_boolean: '{{label}} логикалық мән болуы керек',
    },
    buffer: {
      must_be_buffer: '{{label}} буфер болуы керек',
    },
    stream: {
      must_be_stream: '{{label}} ағын болуы керек',
    },
    date: {
      must_be_date: '{{label}} күн болуы керек',
      not_in_range: '{{label}} рұқсат етілген уақыт ауқымында емес',
    },
    number: {
      must_be_number: '{{label}} сан болуы керек',
      must_be_integer: '{{label}} бүтін сан болуы керек',
      must_be_bigint: '{{label}} BigInt болуы керек',
      not_in_range: '{{label}} рұқсат етілген мән ауқымынан асып түседі',
    },
    string: {
      must_be_string: '{{label}} жол болуы керек',
      must_be_email: '{{label}} электрондық пошта пішімінде болуы керек',
      must_be_hash: '{{label}} хэш пішімінде болуы керек',
      must_be_ip: '{{label}} IP{{versions}} мекенжайы болуы керек',
      must_be_ulid: '{{label}} ULID пішімінде болуы керек',
      must_be_uuid: '{{label}} UUID{{versions}} пішімінде болуы керек',
      length_not_in_range: '{{label}} ұзындығы талаптарға сай емес',
      not_match_pattern: '{{label}} ережелерге сәйкес келмейді',
    },
    object: {
      must_be_object: '{{label}} нысан болуы керек',
    },
    enum: {
      not_in_range: '{{label}} санау ауқымында емес',
      only_support_string_number_boolean:
        'Санақ мәндері тек жолдар, сандар және логикалық мәндер болуы мүмкін',
      value_can_not_be_empty: 'Санақ мәні "{{item}}" бос мән болуы мүмкін емес',
      ranges_can_not_be_empty: 'Санақ ауқымы бос болмауы керек',
      default_not_in_range: '"{{item}}" әдепкі мәні санау ауқымында емес',
    },
    literal: {
      not_match: '{{label}} көрсетілген мән емес',
      unsupported_value: 'Тек жолдарды, сандарды, логикалық мәндерді және нөлді қолдайды',
    },
    one_of: {
      not_match_rule: '{{label}} ережелерге сәйкес келмейді',
      match_multiple_rule: '{{label}} көптеген ережелерге сәйкес келеді',
    },
    any_of: {
      not_match_rule: '{{label}} ережелерге сәйкес келмейді',
    },
    all_of: {
      not_match_all: '{{label}} барлық ережелерге сәйкес келмейді',
    },
    url: {
      must_be_url: '{{label}} URL форматында болуы керек',
      unsupported_scheme:
        '{{label}} құрамында қолдау көрсетілмейтін URL протоколы бар: {{scheme}}',
    },
  },
});
