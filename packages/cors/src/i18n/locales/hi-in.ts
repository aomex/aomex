import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'जब credentials true हो तो origin स्पष्ट रूप से सेट करना आवश्यक है (ठोस origin, श्वेतसूची, या ठोस origin लौटाने वाला फ़ंक्शन); डिफ़ॉल्ट परावर्तन अनुमति नहीं है',
  credentials_with_wildcard_origin:
    'जब credentials true हो तो origin "*" नहीं हो सकता: ब्राउज़र यह संयोजन स्वीकार नहीं करते; ठोस origin, श्वेतसूची, या ठोस origin लौटाने वाला फ़ंक्शन उपयोग करें',
});
