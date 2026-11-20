import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-jp */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'セッションを作成できません：書き込みを複数回試行しましたがすべて失敗しました。ストレージアダプターを確認してください',
  session_max_age_invalid: 'cookie.maxAge は正の数である必要があります（単位：秒）',
});
