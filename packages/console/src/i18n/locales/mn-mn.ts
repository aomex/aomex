import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" команд байхгүй байна',
  command_found_recommended:
    '"{{command}}" команд байхгүй байна. Та "aomex {{recommended}}" гэсэн үг үү?',
  help: {
    command: '[тушаал]',
    option: '[сонголт]',
    version: '{{scriptName}} хувилбарын дугаарыг харуул',
    no_usage: '"{{command}}" командын хэрэглээг олж чадсангүй',
  },
});
