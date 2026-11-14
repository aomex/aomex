import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  eject: 'නියමිත කාර්ය ලැයිස්තුව නිර්යාත කරන්න',
  start: 'නියමිත කාර්යයක් ආරම්භ කරන්න',
  stop: 'නියමිත කාර්යයන් නවත්වන්න',
  stats: 'නියමිත කාර්යයන් ක්‍රියාත්මක කිරීමේ තත්ත්වය පරීක්ෂා කරන්න',
  not_started: 'නියමිත කාර්යය ආරම්භ කර නැත, වරාය: {{port}}',
  invalid_cron_time: 'වලංගු නොවන ක්‍රෝන් ප්‍රකාශනය: {{time}}',
});
