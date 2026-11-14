import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  command_not_found: '«{{command}}» пәрмені жоқ',
  command_found_recommended:
    '«{{command}}» пәрмені жоқ. Сіз «aomex {{recommended}}» дейсіз бе?',
  help: {
    command: '[команда]',
    option: '[опциялар]',
    version: '{{scriptName}} нұсқа нөмірін көрсетіңіз',
    no_usage: '"{{command}}" пәрменін қолдануды табу мүмкін емес',
  },
});
