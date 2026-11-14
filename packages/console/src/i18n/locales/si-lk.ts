import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" විධානය නොපවතී',
  command_found_recommended:
    '"{{command}}" විධානය නොපවතී. ඔබ අදහස් කරන්නේ "aomex {{recommended}}" ද?',
  help: {
    command: '[විධාන]',
    option: '[විකල්ප]',
    version: '{{scriptName}} හි අනුවාද අංකය පෙන්වන්න',
    no_usage: '"{{command}}" විධානයේ භාවිතය සොයාගත නොහැක',
  },
});
