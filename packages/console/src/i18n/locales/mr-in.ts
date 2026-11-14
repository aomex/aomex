import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" कमांड अस्तित्वात नाही',
  command_found_recommended:
    '"{{command}}" कमांड अस्तित्वात नाही. तुम्हाला "aomex {{recommended}}" म्हणायचे आहे का?',
  help: {
    command: '[आदेश]',
    option: '[पर्याय]',
    version: '{{scriptName}} चा आवृत्ती क्रमांक प्रदर्शित करा',
    no_usage: '"{{command}}" कमांडचा वापर आढळू शकत नाही',
  },
});
