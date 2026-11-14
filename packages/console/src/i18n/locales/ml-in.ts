import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" എന്ന കമാൻഡ് നിലവിലില്ല',
  command_found_recommended:
    '"{{command}}" എന്ന കമാൻഡ് നിലവിലില്ല. "aomex {{recommended}}" എന്നാണോ നിങ്ങൾ ഉദ്ദേശിക്കുന്നത്?',
  help: {
    command: '[കമാൻഡ്]',
    option: '[ഓപ്ഷനുകൾ]',
    version: '{{scriptName}}-ൻ്റെ പതിപ്പ് നമ്പർ പ്രദർശിപ്പിക്കുക',
    no_usage: '"{{command}}" എന്ന കമാൻഡിൻ്റെ ഉപയോഗം കണ്ടെത്താനായില്ല',
  },
});
