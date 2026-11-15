import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  eject: '匯出排程任務列表',
  start: '啟動排程任務',
  stop: '停止排程任務',
  stats: '查看排程任務執行狀態',
  not_started: '排程任務未啟動，連接埠：{{port}}',
  invalid_cron_time: '無效的 Cron 運算式：{{time}}',
  invalid_port: '無效的服務連接埠：{{port}}（有效範圍：1-65535）',
});
