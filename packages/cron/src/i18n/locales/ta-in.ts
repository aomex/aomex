import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  eject: 'திட்டமிடப்பட்ட பணிப் பட்டியலை ஏற்றுமதி செய்யவும்',
  start: 'திட்டமிடப்பட்ட பணியைத் தொடங்கவும்',
  stop: 'திட்டமிடப்பட்ட பணிகளை நிறுத்துங்கள்',
  stats: 'திட்டமிடப்பட்ட பணிகளின் செயல்பாட்டின் நிலையை சரிபார்க்கவும்',
  not_started: 'திட்டமிடப்பட்ட பணி தொடங்கப்படவில்லை, போர்ட்: {{port}}',
  invalid_cron_time: 'தவறான கிரான் வெளிப்பாடு: {{time}}',
});
