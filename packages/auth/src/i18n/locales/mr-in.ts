import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-in */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'सत्र तयार करता आले नाही: अनेक लेखन प्रयत्न अयशस्वी, स्टोरेज अॅडॉप्टर तपासा',
  session_max_age_invalid: 'cookie.maxAge धनात्मक संख्या असणे आवश्यक आहे (सेकंदात)',
});
