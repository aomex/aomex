import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  command_not_found: 'ពាក្យបញ្ជា "{{command}}" មិនមានទេ។',
  command_found_recommended:
    'ពាក្យបញ្ជា "{{command}}" មិនមានទេ។ តើអ្នកមានន័យថា "aomex {{recommended}}" ទេ?',
  help: {
    command: '[ពាក្យ​បញ្ជា​]',
    option: '[ជម្រើស]',
    version: 'បង្ហាញលេខកំណែរបស់ {{scriptName}}',
    no_usage: 'ការប្រើប្រាស់ពាក្យបញ្ជា "{{command}}" មិនអាចរកឃើញទេ។',
  },
});
