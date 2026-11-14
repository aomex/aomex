import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" কমান্ডটি বিদ্যমান নেই',
  command_found_recommended:
    '"{{command}}" কমান্ডটি বিদ্যমান নেই। আপনি কি "aomex {{recommended}}" বলতে চান?',
  help: {
    command: '[আদেশ]',
    option: '[বিকল্প]',
    version: '{{scriptName}} সংস্করণ নম্বর প্রদর্শন করুন',
    no_usage: '"{{command}}" কমান্ডের ব্যবহার পাওয়া যাবে না',
  },
});
