import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-np */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'सत्र सिर्जना गर्न सकिएन: धेरै पटक लेख्ने प्रयास असफल भयो, भण्डारण एडेप्टर जाँच गर्नुहोस्',
  session_max_age_invalid: 'cookie.maxAge धनात्मक संख्या हुनुपर्छ (सेकेन्डमा)',
});
