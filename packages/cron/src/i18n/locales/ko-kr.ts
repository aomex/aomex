import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  eject: '예약된 작업 목록 내보내기',
  start: '예약된 작업 시작',
  stop: '예약된 작업 중지',
  stats: '예약된 작업의 실행 상태 확인',
  not_started: '예약된 작업이 시작되지 않았습니다. 포트: {{port}}',
  invalid_cron_time: '잘못된 크론 표현: {{time}}',
  invalid_port: '잘못된 서비스 포트: {{port}} (유효 범위: 1-65535)',
});
