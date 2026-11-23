import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  initialize: '초기화 문서',
  search_channels_files: 'Channel 파일 검색',
  parse_channels: 'Channel 분석',
  hand_fix_documentation: '수동으로 문서 복구',
  save_to_file: '파일에 저장',
  validate: '문서 확인',
  help_summary: 'AsyncAPI 3 문서 생성기',
  has_error: '{{error_count}} 오류, {{warning_count}} 경고',
  no_error: '오류 없음',
});
