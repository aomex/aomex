import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" buyrug\'i mavjud emas',
  command_found_recommended:
    '"{{command}}" buyrug\'i mavjud emas. "aomex {{recommended}}" demoqchimisiz?',
  help: {
    command: '[buyruq]',
    option: '[variantlar]',
    version: "{{scriptName}} versiya raqamini ko'rsating",
    no_usage: '"{{command}}" buyrug\'idan foydalanishni topib bo\'lmadi',
  },
});
