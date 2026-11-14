import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" 명령이 존재하지 않습니다',
  command_found_recommended:
    '"{{command}}" 명령이 존재하지 않습니다. "aomex {{recommended}}"를 의미합니까?',
  help: {
    command: '[명령]',
    option: '[옵션]',
    version: '{{scriptName}}의 버전 번호를 표시합니다.',
    no_usage: '"{{command}}" 명령의 사용법을 찾을 수 없습니다',
  },
});
