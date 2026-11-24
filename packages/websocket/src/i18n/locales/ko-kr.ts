import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  invalid_event_name: '유효하지 않은 이벤트 이름',
  invalid_room_name: '유효하지 않은 방 이름',
  unknown_event: '알 수 없는 이벤트: {{event}}',
  handler_error: '이벤트 처리에 실패했습니다',
  duplicate_event: '이미 등록된 이벤트: {{event}}',
  already_attached: 'WebsocketApp이 이미 attach되었습니다. 다시 마운트하지 마세요',
  transport_init_failed: 'WebSocket 전송 초기화에 실패했습니다',
  handshake_failed: 'WebSocket 핸드셰이크에 실패했습니다',
  accept_failed: '연결을 수락하지 못했습니다',
  fanout_deliver_failed: '팬아웃 중 {{failed}}개 연결에 쓰기를 실패했습니다',
  inbound_task_failed: '인바운드 이벤트 처리에 실패했습니다',
  error_frame_failed: '오류 프레임을 돌려보내지 못했습니다',
  remove_client_failed: '연결을 제거하지 못했습니다',
  close_connection_failed: '연결을 닫지 못했습니다',
  metric_handler_failed: '메트릭 콜백에 실패했습니다',
});
