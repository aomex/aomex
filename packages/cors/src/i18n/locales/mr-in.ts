import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true असताना origin स्पष्टपणे सेट करणे आवश्यक आहे (ठोस origin, श्वेतसूची किंवा ठोस origin परत करणारे फंक्शन); डीफॉल्ट परावर्तन अनुमत नाही',
  credentials_with_wildcard_origin:
    'credentials true असताना origin "*" असू शकत नाही: ब्राउझर हे संयोजन स्वीकारत नाहीत; ठोस origin, श्वेतसूची किंवा ठोस origin परत करणारे फंक्शन वापरा',
});
