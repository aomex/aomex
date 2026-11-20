import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials が true のときは origin を明示的に設定する必要があります（具体的なオリジン、ホワイトリスト、または具体的なオリジンを返す関数）。デフォルトの反射は禁止です',
  credentials_with_wildcard_origin:
    'credentials が true のとき origin を "*" にはできません：ブラウザはこの組み合わせを受け入れません。具体的なオリジン、ホワイトリスト、または具体的なオリジンを返す関数に変更してください',
});
