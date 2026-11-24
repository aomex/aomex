import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  invalid_event_name: '非法的事件名',
  invalid_room_name: '非法的房間名',
  unknown_event: '未知事件：{{event}}',
  handler_error: '事件處理失敗',
  duplicate_event: '事件已註冊：{{event}}',
  already_attached: 'WebsocketApp 已 attach，勿重複掛載',
  transport_init_failed: 'WebSocket 傳輸初始化失敗',
  handshake_failed: 'WebSocket 握手失敗',
  accept_failed: '連接接入失敗',
  fanout_deliver_failed: '扇出時 {{failed}} 個連接寫入失敗',
  inbound_task_failed: '入站事件處理失敗',
  error_frame_failed: '回推錯誤幀失敗',
  remove_client_failed: '移除連接失敗',
  close_connection_failed: '關閉連接失敗',
  metric_handler_failed: '指標回調失敗',
});
