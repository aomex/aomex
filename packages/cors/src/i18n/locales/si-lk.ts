import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true විට origin පැහැදිලිව සැකසිය යුතුය (නිශ්චිත origin, අවසර ලැයිස්තුව හෝ නිශ්චිත origin ආපසු දෙන ශ්‍රිතය); පෙරනිමි පරාවර්තනයට ඉඩ නොදේ',
  credentials_with_wildcard_origin:
    'credentials true විට origin "*" විය නොහැක: බ්‍රව්සර මෙම සංයෝජනය පිළිගන්නේ නැත; නිශ්චිත origin, අවසර ලැයිස්තුව හෝ නිශ්චිත origin ආපසු දෙන ශ්‍රිතයක් භාවිතා කරන්න',
});
