import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  invalid_event_name: '無効なイベント名',
  invalid_room_name: '無効なルーム名',
  unknown_event: '未知のイベント：{{event}}',
  handler_error: 'イベント処理に失敗しました',
  duplicate_event: 'イベントは既に登録されています：{{event}}',
  already_attached:
    'WebsocketApp は既に attach されています。重複してマウントしないでください',
  transport_init_failed: 'WebSocket トランスポートの初期化に失敗しました',
  handshake_failed: 'WebSocket ハンドシェイクに失敗しました',
  accept_failed: '接続の受け入れに失敗しました',
  fanout_deliver_failed: 'ファンアウト中に {{failed}} 件の接続への書き込みが失敗しました',
  inbound_task_failed: '受信イベントの処理に失敗しました',
  error_frame_failed: 'エラーフレームの返送に失敗しました',
  remove_client_failed: '接続の削除に失敗しました',
  close_connection_failed: '接続のクローズに失敗しました',
  metric_handler_failed: 'メトリクスコールバックに失敗しました',
});
