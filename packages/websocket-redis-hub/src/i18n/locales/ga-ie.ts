import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  hub_closed: 'Tá RedisHub dúnta, ní féidir craoladh',
  resync_failed: 'Theip ar athchóiriú síntiús Redis',
  sync_room_failed: 'Theip ar ailíniú síntiús an tseomra: {{room}}',
  bus_fanout_failed: 'Theip ar fhanout an bhus',
  destroy_ready_failed: 'Theip ar fanacht le túsú an Hub agus é á dhúnadh',
});
