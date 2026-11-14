import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" கட்டளை இல்லை',
  command_found_recommended:
    '"{{command}}" கட்டளை இல்லை. நீங்கள் "aomex {{recommended}}" என்று சொல்கிறீர்களா?',
  help: {
    command: '[கட்டளை]',
    option: '[விருப்பங்கள்]',
    version: '{{scriptName}} இன் பதிப்பு எண்ணைக் காண்பி',
    no_usage: '"{{command}}" கட்டளையின் பயன்பாட்டைக் கண்டறிய முடியவில்லை',
  },
});
