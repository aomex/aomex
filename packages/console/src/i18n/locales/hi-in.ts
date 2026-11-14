import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  command_not_found: 'आदेश "{{command}}" मौजूद नहीं है',
  command_found_recommended:
    'आदेश "{{command}}" मौजूद नहीं है. क्या आपका मतलब "aomex {{recommended}}" है?',
  help: {
    command: '[आदेश]',
    option: '[विकल्प]',
    version: '{{scriptName}} की संस्करण संख्या प्रदर्शित करें',
    no_usage: '"{{command}}" कमांड का उपयोग नहीं पाया जा सकता',
  },
});
