import { I18n } from '@aomex/common';

export const zh = I18n.define({
  invalid_event_name: '非法的事件名',
  invalid_room_name: '非法的房间名',
  unknown_event: '未知事件：{{event}}',
  handler_error: '事件处理失败',
  duplicate_event: '事件已注册：{{event}}',
  already_attached: 'WebsocketApp 已 attach，勿重复挂载',
  transport_init_failed: 'WebSocket 传输初始化失败',
  handshake_failed: 'WebSocket 握手失败',
  accept_failed: '连接接入失败',
  fanout_deliver_failed: '扇出时 {{failed}} 个连接写失败',
  inbound_task_failed: '入站事件处理失败',
  error_frame_failed: '回推错误帧失败',
  remove_client_failed: '移除连接失败',
  close_connection_failed: '关闭连接失败',
  metric_handler_failed: '指标回调失败',
});
