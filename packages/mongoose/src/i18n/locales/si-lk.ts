import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} දශම 128 වර්ගයේ විය යුතුය',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId වර්ගයේ විය යුතුය',
    },
  },
  mongoose: {
    unsupported_validator: 'තවමත් {{validator}} සඳහා සහය නොදක්වයි',
  },
  migration: {
    create: 'සංක්‍රමණ ගොනුවක් සාදන්න',
    up: 'සංක්‍රමණය ක්‍රියාත්මක කරන්න',
    down: 'ආපසු හැරවීම සංක්රමණය',
    file_not_found: '"{{file}}" සංක්‍රමණ ගොනුව නොපවතී',
    input_file_name: 'කරුණාකර සංක්‍රමණ ගොනු නාමය ඇතුළත් කරන්න:',
    file_created: 'සංක්‍රමණ ගොනුව සාර්ථකව නිර්මාණය කරන ලදී "{{file}}"',
  },
});
