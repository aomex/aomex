import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'അസാധുവായ ലോഗ് ഫയൽ പാത',
  webhook_request_timed_out: 'Webhook അഭ്യർത്ഥന സമയപരിധി കഴിഞ്ഞു',
  webhook_request_failed: 'Webhook അഭ്യർത്ഥന പരാജയപ്പെട്ടു ({{status}} {{statusText}})',
});
