import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  initialize: '초기화 문서',
  search_routers_files: '라우팅 파일 검색',
  parse_routers: '경로 분석',
  add_tag: '태그 추가',
  hand_fix_documentation: '수동으로 문서 복구',
  optimize_parameter: '최적화 매개변수',
  save_to_file: '파일에 저장',
  validate: '문서 확인',
  help_summary: 'OpenAPI v3 문서 생성기',
  has_error: '{{error_count}} 오류, {{warning_count}} 경고',
  no_error: '오류 없음',
});
