import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} は Decimal128 型でなければなりません',
    },
    objectId: {
      must_be_objectId: '{{label}} は ObjectId タイプである必要があります',
    },
  },
  mongoose: {
    unsupported_validator: 'まだサポートされていません {{validator}}',
  },
  migration: {
    create: '移行ファイルを作成する',
    up: '移行の実行',
    down: 'ロールバック移行',
    file_not_found: '移行ファイル「{{file}}」は存在しません',
    input_file_name: '移行ファイル名を入力してください:',
    file_created: '移行ファイル「{{file}}」が正常に作成されました',
  },
});
