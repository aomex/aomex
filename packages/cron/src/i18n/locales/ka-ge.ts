import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  eject: 'დაგეგმილი ამოცანების სიის ექსპორტი',
  start: 'დაიწყეთ დაგეგმილი დავალება',
  stop: 'შეაჩერე დაგეგმილი ამოცანები',
  stats: 'შეამოწმეთ დაგეგმილი ამოცანების შესრულების სტატუსი',
  not_started: 'დაგეგმილი დავალება არ არის დაწყებული, პორტი: {{port}}',
  invalid_cron_time: 'არასწორი cron გამოხატულება: {{time}}',
  invalid_port: 'არასწორი სერვერის პორტი: {{port}} (მოქმედი დიაპაზონი: 1-65535)',
});
