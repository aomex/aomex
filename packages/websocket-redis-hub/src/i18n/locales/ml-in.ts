import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ml-IN */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub അടച്ചിരിക്കുന്നു, പ്രക്ഷേപണം സാധ്യമല്ല',
  resync_failed: 'Redis സബ്‌സ്‌ക്രിപ്ഷനുകൾ പുനഃസ്ഥാപിക്കാനായില്ല',
  sync_room_failed: 'റൂം സബ്‌സ്‌ക്രിപ്ഷൻ യോജിപ്പിക്കാനായില്ല: {{room}}',
  bus_fanout_failed: 'ബസ് ഫാനൗട്ട് പരാജയപ്പെട്ടു',
  destroy_ready_failed: 'അടയ്ക്കുമ്പോൾ Hub ആരംഭത്തിനായി കാത്തിരിപ്പ് പരാജയപ്പെട്ടു',
});
