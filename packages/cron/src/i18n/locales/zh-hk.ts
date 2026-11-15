import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  eject: '匯出定時任務列表',
  start: '啟動定時任務',
  stop: '停止定時任務',
  stats: '查看定時任務執行狀態',
  not_started: '定時任務未啟動，端口：{{port}}',
  invalid_cron_time: '無效的 Cron 表達式：{{time}}',
  invalid_port: '無效的服務連接埠：{{port}}（有效範圍：1-65535）',
});
