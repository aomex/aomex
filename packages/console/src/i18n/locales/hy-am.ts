import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  command_not_found: '«{{command}}» հրամանը գոյություն չունի',
  command_found_recommended:
    '«{{command}}» հրամանը գոյություն չունի: Նկատի ունեք «aomex {{recommended}}»-ը:',
  help: {
    command: '[հրաման]',
    option: '[տարբերակներ]',
    version: 'Ցուցադրել {{scriptName}}-ի տարբերակի համարը',
    no_usage: '«{{command}}» հրամանի օգտագործումը հնարավոր չէ գտնել',
  },
});
