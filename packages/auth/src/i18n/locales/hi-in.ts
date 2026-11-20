import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-in */
export default I18n.satisfies(zh).define({
  session_create_failed: 'सत्र नहीं बनाया जा सका: कई लेखन प्रयास विफल रहे, स्टोरेज एडेप्टर जाँचें',
  session_max_age_invalid: 'cookie.maxAge धनात्मक संख्या होनी चाहिए (सेकंड में)',
});
