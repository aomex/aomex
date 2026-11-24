import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub가 닫혀 브로드캐스트할 수 없습니다',
  resync_failed: 'Redis 구독 복원에 실패했습니다',
  sync_room_failed: '방 구독 정렬에 실패했습니다: {{room}}',
  bus_fanout_failed: '버스 팬아웃에 실패했습니다',
  destroy_ready_failed: '종료 중 Hub 초기화 대기에 실패했습니다',
});
