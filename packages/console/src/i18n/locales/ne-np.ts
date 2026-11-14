import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  command_not_found: 'आदेश "{{command}}" अवस्थित छैन',
  command_found_recommended:
    'आदेश "{{command}}" अवस्थित छैन। के तपाईको मतलब "aomex {{recommended}}" हो?',
  help: {
    command: '[आदेश]',
    option: '[विकल्पहरू]',
    version: '{{scriptName}} को संस्करण नम्बर प्रदर्शन गर्नुहोस्',
    no_usage: 'आदेश "{{command}}" को प्रयोग फेला पार्न सकिँदैन',
  },
});
