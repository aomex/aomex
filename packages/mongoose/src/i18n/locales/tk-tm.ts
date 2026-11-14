import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} “Decimal128” görnüşli bolmaly',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId görnüşli bolmaly',
    },
  },
  mongoose: {
    unsupported_validator: 'Entek goldanok {{validator}}',
  },
  migration: {
    create: 'Migrasiýa faýly dörediň',
    up: 'Migrasiýa ýerine ýetiriň',
    down: 'Yza gaýdyp gelmek',
    file_not_found: '"{{file}}" göçürme faýly ýok',
    input_file_name: 'Migrasiýa faýlynyň adyny giriziň:',
    file_created: 'Migrasiýa faýly üstünlikli "{{file}}" döredildi',
  },
});
