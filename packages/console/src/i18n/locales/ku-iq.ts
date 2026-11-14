import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  command_not_found: 'فەرمانی "{{command}}" بوونی نییە',
  command_found_recommended:
    'فەرمانی "{{command}}" بوونی نییە. مەبەستت "aomex {{recommended}}"ە؟',
  help: {
    command: '[فەرمان]',
    option: '[هەڵبژاردنەکان]',
    version: 'ژمارەی وەشانی {{scriptName}} پیشان بدە',
    no_usage: 'بەکارهێنانی فرمانی "{{command}}" نادۆزرێتەوە',
  },
});
