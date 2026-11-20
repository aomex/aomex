import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true हुँदा origin स्पष्ट रूपमा सेट गर्नुपर्छ (ठोस origin, सेतो सूची, वा ठोस origin फर्काउने फङ्सन); पूर्वनिर्धारित परावर्तन अनुमति छैन',
  credentials_with_wildcard_origin:
    'credentials true हुँदा origin "*" हुन सक्दैन: ब्राउजरहरूले यो संयोजन स्वीकार्दैनन्; ठोस origin, सेतो सूची, वा ठोस origin फर्काउने फङ्सन प्रयोग गर्नुहोस्',
});
