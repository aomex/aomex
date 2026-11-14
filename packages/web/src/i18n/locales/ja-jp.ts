import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} はファイルでなければなりません',
      too_large: '{{label}} ファイルが大きすぎます',
      unsupported_mimetype: 'ファイルタイプ {{label}} はサポートされていません',
    },
  },
  response: {
    redirect: '{{url}} にリダイレクトしています',
  },
});
